from typing import List, Dict, Any, Optional
from datetime import datetime


class AIService:
    """AI service for risk assessment, medication reminders, and care recommendations."""

    # Blood pressure thresholds (mmHg)
    BP_NORMAL = (120, 80)
    BP_ELEVATED = (130, 80)
    BP_STAGE1 = (140, 90)
    BP_STAGE2 = (180, 120)

    # MMSE score thresholds (0-30, lower = more severe)
    MMSE_NORMAL = 24
    MMSE_MILD = 18
    MMSE_MODERATE = 10

    def assess_risk(self, patient, latest_record) -> Dict[str, Any]:
        """Assess overall health risk for a patient."""
        risks = []
        risk_score = 0

        # Age-based risk
        if patient.age:
            if patient.age >= 85:
                risk_score += 30
                risks.append({"factor": "高龄", "level": "high", "detail": f"年龄 {patient.age} 岁，属于高风险年龄段"})
            elif patient.age >= 75:
                risk_score += 15
                risks.append({"factor": "年龄", "level": "medium", "detail": f"年龄 {patient.age} 岁，需密切关注"})

        # Dementia stage risk
        dementia_risks = {
            "severe": (40, "high", "重度痴呆，需要全天候护理"),
            "moderate": (25, "medium", "中度痴呆，日常活动需要辅助"),
            "mild": (10, "low", "轻度痴呆，需要定期监测"),
        }
        if patient.dementia_stage and patient.dementia_stage in dementia_risks:
            score, level, detail = dementia_risks[patient.dementia_stage]
            risk_score += score
            risks.append({"factor": "痴呆程度", "level": level, "detail": detail})

        # Hypertension risk
        hypertension_risks = {
            "crisis": (35, "critical", "高血压危象，需立即就医"),
            "stage2": (25, "high", "高血压2期，需积极治疗"),
            "stage1": (15, "medium", "高血压1期，需控制血压"),
        }
        if patient.hypertension_level and patient.hypertension_level in hypertension_risks:
            score, level, detail = hypertension_risks[patient.hypertension_level]
            risk_score += score
            risks.append({"factor": "高血压", "level": level, "detail": detail})

        # Latest health record risk
        if latest_record:
            if latest_record.systolic_bp and latest_record.systolic_bp >= 180:
                risk_score += 20
                risks.append({
                    "factor": "收缩压",
                    "level": "critical",
                    "detail": f"收缩压 {latest_record.systolic_bp} mmHg，危险水平"
                })
            elif latest_record.systolic_bp and latest_record.systolic_bp >= 140:
                risk_score += 10
                risks.append({
                    "factor": "收缩压",
                    "level": "high",
                    "detail": f"收缩压 {latest_record.systolic_bp} mmHg，需关注"
                })

            if latest_record.mmse_score is not None:
                if latest_record.mmse_score < self.MMSE_MODERATE:
                    risk_score += 20
                    risks.append({
                        "factor": "认知功能",
                        "level": "high",
                        "detail": f"MMSE评分 {latest_record.mmse_score}，认知功能严重受损"
                    })
                elif latest_record.mmse_score < self.MMSE_MILD:
                    risk_score += 10
                    risks.append({
                        "factor": "认知功能",
                        "level": "medium",
                        "detail": f"MMSE评分 {latest_record.mmse_score}，认知功能中度受损"
                    })

        # Determine overall risk level
        if risk_score >= 70:
            overall_level = "critical"
            overall_label = "极高风险"
        elif risk_score >= 50:
            overall_level = "high"
            overall_label = "高风险"
        elif risk_score >= 25:
            overall_level = "medium"
            overall_label = "中等风险"
        else:
            overall_level = "low"
            overall_label = "低风险"

        return {
            "patient_id": patient.id,
            "risk_score": min(risk_score, 100),
            "overall_level": overall_level,
            "overall_label": overall_label,
            "risk_factors": risks,
            "assessed_at": datetime.utcnow().isoformat(),
        }

    def generate_medication_reminders(self, patient, medications) -> Dict[str, Any]:
        """Generate medication reminder schedule."""
        reminders = []
        frequency_times = {
            "once_daily": ["08:00"],
            "twice_daily": ["08:00", "20:00"],
            "three_times_daily": ["08:00", "13:00", "20:00"],
            "four_times_daily": ["08:00", "12:00", "16:00", "20:00"],
            "with_meals": ["07:30", "12:30", "18:30"],
            "before_sleep": ["21:00"],
        }

        for med in medications:
            times = frequency_times.get(med.frequency, ["08:00"])
            for time in times:
                reminders.append({
                    "medication_id": med.id,
                    "medication_name": med.name,
                    "dosage": med.dosage,
                    "time": time,
                    "purpose": med.purpose,
                    "notes": med.notes,
                })

        # Sort by time
        reminders.sort(key=lambda x: x["time"])

        return {
            "patient_id": patient.id,
            "patient_name": patient.name,
            "total_medications": len(medications),
            "daily_reminders": reminders,
            "generated_at": datetime.utcnow().isoformat(),
        }

    def generate_care_recommendations(self, patient, records: list, medications: list) -> Dict[str, Any]:
        """Generate personalized care recommendations."""
        recommendations = []

        # Dementia-specific recommendations
        dementia_recommendations = {
            "mild": [
                {"category": "认知训练", "priority": "high", "recommendation": "每日进行记忆训练游戏，如拼图、数字游戏等，建议每次30分钟"},
                {"category": "社交活动", "priority": "medium", "recommendation": "鼓励参加社区活动，保持社交联系，有助于延缓认知退化"},
                {"category": "日常结构", "priority": "high", "recommendation": "保持规律的日常作息，固定的进餐、睡眠时间有助于定向力"},
                {"category": "安全措施", "priority": "medium", "recommendation": "检查家居安全，移除绊倒风险，标记重要房间"},
            ],
            "moderate": [
                {"category": "照护支持", "priority": "critical", "recommendation": "需要专业照护人员协助日常活动，建议评估日间照护中心"},
                {"category": "沟通方式", "priority": "high", "recommendation": "使用简单直接的语言沟通，配合图片和手势"},
                {"category": "环境调整", "priority": "high", "recommendation": "简化家居环境，添加标识牌，使用夜灯防止跌倒"},
                {"category": "行为管理", "priority": "medium", "recommendation": "制定应对激动、焦虑行为的策略，保持环境安静"},
            ],
            "severe": [
                {"category": "全天护理", "priority": "critical", "recommendation": "需要全天候专业护理，评估长期照护机构的适宜性"},
                {"category": "营养支持", "priority": "critical", "recommendation": "监测吞咽功能，必要时调整饮食质地，预防误吸"},
                {"category": "压疮预防", "priority": "high", "recommendation": "定期变换体位，使用特殊床垫，保持皮肤干燥清洁"},
                {"category": "疼痛管理", "priority": "high", "recommendation": "评估非语言疼痛信号，及时处理不适"},
            ],
        }

        if patient.dementia_stage in dementia_recommendations:
            recommendations.extend(dementia_recommendations[patient.dementia_stage])

        # Hypertension recommendations
        hypertension_recommendations = {
            "stage1": [
                {"category": "饮食控制", "priority": "high", "recommendation": "采用DASH饮食，减少钠摄入（< 2300mg/天），增加钾、钙、镁摄入"},
                {"category": "运动建议", "priority": "medium", "recommendation": "每周150分钟中等强度有氧运动，如散步、游泳（需医生评估后进行）"},
                {"category": "生活方式", "priority": "medium", "recommendation": "戒烟限酒，减轻体重，管理压力"},
            ],
            "stage2": [
                {"category": "血压监测", "priority": "critical", "recommendation": "每日监测血压，记录晨起和睡前血压，发现异常及时就医"},
                {"category": "药物依从", "priority": "critical", "recommendation": "严格按时按量服用降压药，不可自行减量或停药"},
                {"category": "饮食控制", "priority": "high", "recommendation": "严格限制钠摄入（< 1500mg/天），避免高脂、高糖食物"},
                {"category": "并发症预防", "priority": "high", "recommendation": "定期检查心、脑、肾功能，警惕高血压并发症"},
            ],
            "crisis": [
                {"category": "紧急处理", "priority": "critical", "recommendation": "血压危象状态，需立即就医，严格卧床休息"},
                {"category": "持续监测", "priority": "critical", "recommendation": "每小时监测血压，直至稳定"},
            ],
        }

        if patient.hypertension_level in hypertension_recommendations:
            recommendations.extend(hypertension_recommendations[patient.hypertension_level])

        # Check latest health records for specific recommendations
        if records:
            latest = records[0]
            if latest.blood_glucose and latest.blood_glucose > 200:
                recommendations.append({
                    "category": "血糖管理",
                    "priority": "high",
                    "recommendation": f"血糖偏高({latest.blood_glucose} mg/dL)，建议咨询内分泌科，调整饮食，增加监测频率"
                })

        # General recommendations for elderly
        recommendations.extend([
            {"category": "跌倒预防", "priority": "high", "recommendation": "评估跌倒风险，安装扶手，使用防滑垫，必要时使用助行器"},
            {"category": "营养管理", "priority": "medium", "recommendation": "确保充足的蛋白质、钙和维生素D摄入，预防肌少症和骨质疏松"},
            {"category": "睡眠管理", "priority": "medium", "recommendation": "保持规律睡眠，避免日间过度睡眠，创造安静舒适的睡眠环境"},
        ])

        # Sort by priority
        priority_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        recommendations.sort(key=lambda x: priority_order.get(x["priority"], 4))

        return {
            "patient_id": patient.id,
            "patient_name": patient.name,
            "recommendations": recommendations,
            "total_count": len(recommendations),
            "generated_at": datetime.utcnow().isoformat(),
        }

    def generate_alerts(self, patient, latest_record) -> Dict[str, Any]:
        """Generate health alerts based on current vitals."""
        alerts = []

        if latest_record:
            # Blood pressure alerts
            if latest_record.systolic_bp:
                if latest_record.systolic_bp >= 180 or (latest_record.diastolic_bp and latest_record.diastolic_bp >= 120):
                    alerts.append({
                        "type": "critical",
                        "category": "血压",
                        "message": f"血压危象！收缩压 {latest_record.systolic_bp}/{latest_record.diastolic_bp} mmHg，需立即就医",
                        "action": "立即联系医生"
                    })
                elif latest_record.systolic_bp >= 160:
                    alerts.append({
                        "type": "high",
                        "category": "血压",
                        "message": f"血压偏高：{latest_record.systolic_bp}/{latest_record.diastolic_bp} mmHg",
                        "action": "检查是否按时服药，联系医生"
                    })

            # Heart rate alerts
            if latest_record.heart_rate:
                if latest_record.heart_rate > 100:
                    alerts.append({
                        "type": "medium",
                        "category": "心率",
                        "message": f"心率偏快：{latest_record.heart_rate} bpm",
                        "action": "休息观察，必要时就医"
                    })
                elif latest_record.heart_rate < 50:
                    alerts.append({
                        "type": "high",
                        "category": "心率",
                        "message": f"心率过慢：{latest_record.heart_rate} bpm",
                        "action": "及时就医"
                    })

            # Blood glucose alerts
            if latest_record.blood_glucose:
                if latest_record.blood_glucose > 300:
                    alerts.append({
                        "type": "critical",
                        "category": "血糖",
                        "message": f"血糖危险偏高：{latest_record.blood_glucose} mg/dL",
                        "action": "立即就医"
                    })
                elif latest_record.blood_glucose < 70:
                    alerts.append({
                        "type": "critical",
                        "category": "血糖",
                        "message": f"低血糖！血糖 {latest_record.blood_glucose} mg/dL",
                        "action": "立即补充糖分，通知医护人员"
                    })

            # Temperature alerts
            if latest_record.temperature:
                if latest_record.temperature >= 38.5:
                    alerts.append({
                        "type": "high",
                        "category": "体温",
                        "message": f"发热：体温 {latest_record.temperature}°C",
                        "action": "物理降温，及时就医"
                    })

            # MMSE alerts
            if latest_record.mmse_score is not None and latest_record.mmse_score < 10:
                alerts.append({
                    "type": "high",
                    "category": "认知功能",
                    "message": f"认知功能严重受损，MMSE评分：{latest_record.mmse_score}/30",
                    "action": "联系神经内科医生，评估护理级别"
                })

        return {
            "patient_id": patient.id,
            "total_alerts": len(alerts),
            "critical_count": sum(1 for a in alerts if a["type"] == "critical"),
            "alerts": alerts,
            "checked_at": datetime.utcnow().isoformat(),
        }
