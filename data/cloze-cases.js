const CLOZE_CASES = [
  {
    "unit": "Unit5",
    "caseId": "5-1",
    "title": "Infective Endocarditis",
    "pages": [
      136,
      137
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Infective Endocarditis E.F. is a 72-year-old man who comes to the clinic with “flulike” symptoms. He has a history of hypertension, past MRSA infection, and a recently implanted pacemaker. E.F. has petechiae in the conjunctivae and splinter hemorrhages in his nail beds. His blood pressure is 138/64, heart rate 80, respiratory rate 18, and temperature 99.5° F (37.5° C). Physical examination revealed a pansystolic murmur over the apex and left lower sternal border. Transthoracic echocardiography revealed a vegetation with size of 0.9 cm over the anterior leaflet of mitral valve, and moderate mitral regurgitation. However, the cardiac systolic and diastolic functions were normal. The health care provider suspects infective endocarditis, an infection of the endocardium, which is often difficult to recognize and therefore easily missed in the emergency department. E.F. is sent to the hospital for further workup and treatment and his blood culture results are positive for Staphylococcus aureus. E.F. is started on IV antibiotics and seems to be resting comfortably. He occasionally requests PRN drugs for “achiness” and continues to have a low-grade fever. He is not demonstrating any symptoms of heart failure at this time. E.F. has completed a week of IV antibiotic therapy in the hospital setting. He is afebrile and feeling better. Social service has arranged home IV antibiotic therapy in anticipation of discharge to home.",
    "wordCount": 228,
    "blankCandidates": [
      {
        "answer": "hypertension",
        "type": "history",
        "meaning": "高血压",
        "reason": "core case term",
        "distractors": [
          "MRSA infection",
          "pacemaker",
          "petechiae"
        ]
      },
      {
        "answer": "MRSA infection",
        "type": "history",
        "meaning": "耐甲氧西林金黄色葡萄球菌感染",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "pacemaker",
          "petechiae"
        ]
      },
      {
        "answer": "pacemaker",
        "type": "device",
        "meaning": "起搏器",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "petechiae"
        ]
      },
      {
        "answer": "petechiae",
        "type": "sign",
        "meaning": "瘀点",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "conjunctivae",
        "type": "anatomy",
        "meaning": "结膜",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "splinter hemorrhages",
        "type": "sign",
        "meaning": "裂片形出血",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "nail beds",
        "type": "anatomy",
        "meaning": "甲床",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "blood pressure",
        "type": "vital sign",
        "meaning": "血压",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "respiratory rate",
        "type": "vital sign",
        "meaning": "呼吸频率",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "temperature",
        "type": "vital sign",
        "meaning": "体温",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "pansystolic murmur",
        "type": "sign",
        "meaning": "全收缩期杂音",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "vegetation",
        "type": "finding",
        "meaning": "赘生物",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "anterior leaflet",
        "type": "anatomy",
        "meaning": "前叶",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "mitral valve",
        "type": "anatomy",
        "meaning": "二尖瓣",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "mitral regurgitation",
        "type": "diagnosis",
        "meaning": "二尖瓣反流",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "infective endocarditis",
        "type": "diagnosis",
        "meaning": "感染性心内膜炎",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "endocardium",
        "type": "anatomy",
        "meaning": "心内膜",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "workup",
        "type": "clinical process",
        "meaning": "诊断性检查",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "blood culture",
        "type": "test",
        "meaning": "血培养",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "Staphylococcus aureus",
        "type": "pathogen",
        "meaning": "金黄色葡萄球菌",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "IV antibiotics",
        "type": "treatment",
        "meaning": "静脉抗生素",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "PRN drugs",
        "type": "medication order",
        "meaning": "必要时用药",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "low-grade fever",
        "type": "symptom",
        "meaning": "低热",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "heart failure",
        "type": "condition",
        "meaning": "心力衰竭",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      },
      {
        "answer": "afebrile",
        "type": "condition",
        "meaning": "无发热",
        "reason": "core case term",
        "distractors": [
          "hypertension",
          "MRSA infection",
          "pacemaker"
        ]
      }
    ]
  },
  {
    "unit": "Unit5",
    "caseId": "5-2",
    "title": "Mitral Valve Replacement Operative Report",
    "pages": [
      138,
      139
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Mitral Valve Replacement Operative Report A.L. was diagnosed with mitral prolapse with regurgitation and was transferred to the operating room, placed in a supine position, and given general endotracheal anesthesia. Her pericardium was entered longitudinally through a median sternotomy. The surgeon found that her heart was enlarged with a dilated right ventricle. The left atrium was dilated. Preoperative transesophageal echocardiogram revealed severe mitral regurgitation with severe posterior and anterior prolapse. Extracorporeal circulation was established. The aorta was cross-clamped, and cardioplegic solution (to stop the heartbeat) was given into the aortic root intermittently for myocardial protection. The left atrium was entered via the interatrial groove on the right, exposing the mitral valve. The middle scallop of the posterior leaflet was resected. The remaining leaflets were removed to the areas of the commissures and preserved for the sliding plasty. The elongated chordae were shortened. The surgeon slid the posterior leaflet across the midline and sutured it in place. A No. 30 annuloplasty ring was sutured in place with interrupted No. 2-0 Dacron suture. The valve was tested by inflating the ventricle with NSS and proved to be competent. The left atrium was closed with continuous No. 4-0 Prolene suture. Air was removed from the heart. The cross-clamp was removed. Cardiac action resumed with normal sinus rhythm. After a period of cardiac recovery and attainment of normothermia, cardiopulmonary bypass was discontinued. Protamine was given to counteract the heparin. Pacer wires were placed in the right atrium and ventricle. Silicone catheters were placed in the pleural and substernal spaces. The sternum and soft tissue wound was closed. A. L. recovered from her surgery and was discharged 6 days later.",
    "wordCount": 278,
    "blankCandidates": [
      {
        "answer": "mitral prolapse",
        "type": "diagnosis",
        "meaning": "二尖瓣脱垂",
        "reason": "core case term",
        "distractors": [
          "regurgitation",
          "supine position",
          "general endotracheal anesthesia"
        ]
      },
      {
        "answer": "regurgitation",
        "type": "diagnosis",
        "meaning": "反流",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "supine position",
          "general endotracheal anesthesia"
        ]
      },
      {
        "answer": "supine position",
        "type": "position",
        "meaning": "仰卧位",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "general endotracheal anesthesia"
        ]
      },
      {
        "answer": "general endotracheal anesthesia",
        "type": "anesthesia",
        "meaning": "全身气管内麻醉",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "pericardium",
        "type": "anatomy",
        "meaning": "心包",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "median sternotomy",
        "type": "procedure",
        "meaning": "胸骨正中切开术",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "dilated right ventricle",
        "type": "finding",
        "meaning": "右心室扩张",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "right ventricle",
        "type": "anatomy",
        "meaning": "右心室",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "left atrium",
        "type": "anatomy",
        "meaning": "左心房",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "transesophageal echocardiogram",
        "type": "test",
        "meaning": "经食管超声心动图",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "severe posterior and anterior prolapse",
        "type": "finding",
        "meaning": "严重后叶和前叶脱垂",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "aorta",
        "type": "anatomy",
        "meaning": "主动脉",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "cross-clamped",
        "type": "procedure",
        "meaning": "阻断",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "cardioplegic solution",
        "type": "medication",
        "meaning": "心脏停搏液",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "aortic root",
        "type": "anatomy",
        "meaning": "主动脉根部",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "myocardial protection",
        "type": "purpose",
        "meaning": "心肌保护",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "interatrial groove",
        "type": "anatomy",
        "meaning": "房间沟",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "mitral valve",
        "type": "anatomy",
        "meaning": "二尖瓣",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "posterior leaflet",
        "type": "anatomy",
        "meaning": "后瓣叶",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "commissures",
        "type": "anatomy",
        "meaning": "瓣膜交界处",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "sliding plasty",
        "type": "procedure",
        "meaning": "滑动成形术",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "elongated chordae",
        "type": "finding",
        "meaning": "腱索延长",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "annuloplasty ring",
        "type": "device",
        "meaning": "瓣环成形环",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "Dacron suture",
        "type": "device",
        "meaning": "涤纶缝线",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "NSS",
        "type": "solution",
        "meaning": "生理盐水",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "Prolene suture",
        "type": "device",
        "meaning": "普理灵缝线",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "normal sinus rhythm",
        "type": "finding",
        "meaning": "正常窦性心律",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "cardiopulmonary bypass",
        "type": "procedure",
        "meaning": "心肺转流",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "heparin",
        "type": "medication",
        "meaning": "肝素",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      },
      {
        "answer": "pleural and substernal spaces",
        "type": "anatomy",
        "meaning": "胸膜和胸骨下间隙",
        "reason": "core case term",
        "distractors": [
          "mitral prolapse",
          "regurgitation",
          "supine position"
        ]
      }
    ]
  },
  {
    "unit": "Unit6",
    "caseId": "6-1",
    "title": "Blood Replacement",
    "pages": [
      160,
      161
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Blood Replacement C.L., a 16-YO girl, sustained a ruptured liver when she hit a tree while sledding. Emergency surgery was needed to stop the internal bleeding. During surgery, the ruptured segment of the liver was removed, and the laceration was sutured with a heavy, absorbable suture on a large smooth needle. Before surgery, her hemoglobin was 10.2 g/dL, but the reading decreased to 7.6 g/dL before hemostasis was attained. Cell salvage, or autotransfusion, was set up. In this procedure, the free blood was suctioned from her abdomen and mixed with an anticoagulant (heparin). The RBCs were washed in a sterile centrifuge with NS and transfused back to her through tubing fitted with a filter. She also received six units of homologous, leukocyte-reduced whole blood, five units of fresh frozen plasma, and two units of platelets. During the surgery, the CRNA repeatedly tested her Hgb and Hct as well as prothrombin time and partial thromboplastin time to monitor her clotting mechanisms. C.L. is B-positive. Fortunately, there was enough B-positive blood in the hospital blood bank for her surgery. The lab informed her surgeon that they had two units of B-negative and six units of O-negative blood, which she could have received safely if she needed more blood during the night. However, her hemoglobin level increased to 12 g/dL, and she was stable during her recovery. She was monitored for DIC and pulmonary emboli.",
    "wordCount": 238,
    "blankCandidates": [
      {
        "answer": "ruptured liver",
        "type": "injury",
        "meaning": "肝破裂",
        "reason": "core case term",
        "distractors": [
          "internal bleeding",
          "laceration",
          "absorbable suture"
        ]
      },
      {
        "answer": "internal bleeding",
        "type": "condition",
        "meaning": "内出血",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "laceration",
          "absorbable suture"
        ]
      },
      {
        "answer": "laceration",
        "type": "injury",
        "meaning": "裂伤",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "absorbable suture"
        ]
      },
      {
        "answer": "absorbable suture",
        "type": "device",
        "meaning": "可吸收缝线",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "hemoglobin",
        "type": "test",
        "meaning": "血红蛋白",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "hemostasis",
        "type": "process",
        "meaning": "止血",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "autotransfusion",
        "type": "procedure",
        "meaning": "自体输血",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "suctioned",
        "type": "procedure",
        "meaning": "吸出",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "abdomen",
        "type": "anatomy",
        "meaning": "腹部",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "anticoagulant",
        "type": "medication class",
        "meaning": "抗凝剂",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "heparin",
        "type": "medication",
        "meaning": "肝素",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "RBCs",
        "type": "blood component",
        "meaning": "红细胞",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "sterile centrifuge",
        "type": "equipment",
        "meaning": "无菌离心机",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "NS",
        "type": "solution",
        "meaning": "生理盐水",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "transfused",
        "type": "procedure",
        "meaning": "输注",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "filter",
        "type": "equipment",
        "meaning": "过滤器",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "homologous",
        "type": "transfusion type",
        "meaning": "同种异体的",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "leukocyte-reduced whole blood",
        "type": "blood product",
        "meaning": "去白细胞全血",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "fresh frozen plasma",
        "type": "blood product",
        "meaning": "新鲜冰冻血浆",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "platelets",
        "type": "blood component",
        "meaning": "血小板",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "CRNA",
        "type": "role",
        "meaning": "注册麻醉护士",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "Hgb",
        "type": "test",
        "meaning": "血红蛋白",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "Hct",
        "type": "test",
        "meaning": "血细胞比容",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "prothrombin time",
        "type": "test",
        "meaning": "凝血酶原时间",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "partial thromboplastin time",
        "type": "test",
        "meaning": "部分凝血活酶时间",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "clotting mechanisms",
        "type": "physiology",
        "meaning": "凝血机制",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "hospital blood bank",
        "type": "facility",
        "meaning": "医院血库",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "DIC",
        "type": "complication",
        "meaning": "弥散性血管内凝血",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      },
      {
        "answer": "pulmonary emboli",
        "type": "complication",
        "meaning": "肺栓塞",
        "reason": "core case term",
        "distractors": [
          "ruptured liver",
          "internal bleeding",
          "laceration"
        ]
      }
    ]
  },
  {
    "unit": "Unit6",
    "caseId": "6-2",
    "title": "Acute Myelocytic Leukemia",
    "pages": [
      161,
      162
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Acute Myelocytic Leukemia This 58-year-old man was admitted because of recurrent fever, chills, and night sweat for two weeks. Six weeks before admission, he was suspected as myelodysplastic syndrome (MDA) in a health examination and went to our outpatient clinic for consultation when he was asymptomatic except for dizziness and weakness. Complete blood count found megaloblastic anemia and bone marrow aspiration revealed abnormal localization of immature precursor. So MDA was diagnosed and he was given folic acid, vitamin B12 and prednisone, as well as interferon. Two weeks before admission, he developed chills, fever, night sweat and malodorous discharge from a spontaneous presacral ulcer, associated with mild local pain. Vancomycin, levofloxacin, and metronidazole were given intravenously. The fever resolved on the seventh day but relapsed 6 days later and the white-cell count rose to 88×109 /L with 46% blasts. The peripheral-blood smear contained immature monocytoid cells. The specimen obtained from the bone marrow biopsy was markedly hypercellular and contained predominantly large cells with folded nuclei and moderate amounts of pale cytoplasm containing Auer rods, the characteristic of monoblasts. Dysplasia was present in all three cell lines, as shown by hypogranular neutrophils, small megakaryocytes with hypolobulated nuclei, and nuclear irregularity in the few erythroid elements identified. Immunophenotyping of the bone marrow aspiration by flow cytometry revealed CD45 + , dimly CD34+ , HLA-DR+ , blasts expressing the myeloid markers CD33, myeloperoxidase, CD117 and the monocytic markers CD64 and CD14. Cytogenetic analysis revealed a normal karyotype (46, XY). The peripheral-blood smear and the bone marrow aspiration and biopsy specimen suggested acute myelocytic leukemia (AML). Unit 6 Cardiovascular System II:The Blood and Blood Circulation 153",
    "wordCount": 277,
    "blankCandidates": [
      {
        "answer": "recurrent fever",
        "type": "symptom",
        "meaning": "反复发热",
        "reason": "core case term",
        "distractors": [
          "chills",
          "night sweat",
          "myelodysplastic syndrome"
        ]
      },
      {
        "answer": "chills",
        "type": "symptom",
        "meaning": "寒战",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "night sweat",
          "myelodysplastic syndrome"
        ]
      },
      {
        "answer": "night sweat",
        "type": "symptom",
        "meaning": "盗汗",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "myelodysplastic syndrome"
        ]
      },
      {
        "answer": "myelodysplastic syndrome",
        "type": "diagnosis",
        "meaning": "骨髓增生异常综合征",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "dizziness",
        "type": "symptom",
        "meaning": "头晕",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "weakness",
        "type": "symptom",
        "meaning": "乏力",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "Complete blood count",
        "type": "test",
        "meaning": "全血细胞计数",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "megaloblastic anemia",
        "type": "diagnosis",
        "meaning": "巨幼细胞性贫血",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "bone marrow aspiration",
        "type": "test",
        "meaning": "骨髓穿刺",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "immature precursor",
        "type": "cell",
        "meaning": "未成熟前体细胞",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "folic acid",
        "type": "medication",
        "meaning": "叶酸",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "vitamin B12",
        "type": "medication",
        "meaning": "维生素B12",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "prednisone",
        "type": "medication",
        "meaning": "泼尼松",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "interferon",
        "type": "medication",
        "meaning": "干扰素",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "malodorous discharge",
        "type": "symptom",
        "meaning": "恶臭分泌物",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "presacral ulcer",
        "type": "finding",
        "meaning": "骶前溃疡",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "levofloxacin",
        "type": "medication",
        "meaning": "左氧氟沙星",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "metronidazole",
        "type": "medication",
        "meaning": "甲硝唑",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "intravenously",
        "type": "route",
        "meaning": "静脉给药",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "white-cell count",
        "type": "test",
        "meaning": "白细胞计数",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "blasts",
        "type": "cell",
        "meaning": "原始细胞",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "peripheral-blood smear",
        "type": "test",
        "meaning": "外周血涂片",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "bone marrow biopsy",
        "type": "test",
        "meaning": "骨髓活检",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "hypercellular",
        "type": "finding",
        "meaning": "细胞过多",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "folded nuclei",
        "type": "finding",
        "meaning": "折叠状细胞核",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "pale cytoplasm",
        "type": "finding",
        "meaning": "淡染胞质",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "Auer rods",
        "type": "finding",
        "meaning": "奥尔小体",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "monoblasts",
        "type": "cell",
        "meaning": "单原始细胞",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "Dysplasia",
        "type": "finding",
        "meaning": "发育异常",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "hypogranular neutrophils",
        "type": "cell finding",
        "meaning": "低颗粒中性粒细胞",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "megakaryocytes",
        "type": "cell",
        "meaning": "巨核细胞",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "erythroid elements",
        "type": "cell",
        "meaning": "红系成分",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "flow cytometry",
        "type": "test",
        "meaning": "流式细胞术",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "CD45",
        "type": "marker",
        "meaning": "CD45",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "CD34",
        "type": "marker",
        "meaning": "CD34",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "HLA-DR",
        "type": "marker",
        "meaning": "HLA-DR",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "CD33",
        "type": "marker",
        "meaning": "CD33",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "myeloperoxidase",
        "type": "marker",
        "meaning": "髓过氧化物酶",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "CD117",
        "type": "marker",
        "meaning": "CD117",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "CD64",
        "type": "marker",
        "meaning": "CD64",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "CD14",
        "type": "marker",
        "meaning": "CD14",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "Cytogenetic analysis",
        "type": "test",
        "meaning": "细胞遗传学分析",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "normal karyotype",
        "type": "finding",
        "meaning": "正常核型",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      },
      {
        "answer": "acute myelocytic leukemia",
        "type": "diagnosis",
        "meaning": "急性髓细胞白血病",
        "reason": "core case term",
        "distractors": [
          "recurrent fever",
          "chills",
          "night sweat"
        ]
      }
    ]
  },
  {
    "unit": "Unit7",
    "caseId": "7-1",
    "title": "Renal Calculi",
    "pages": [
      188,
      189
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Renal Calculi A.A., a 48-year-old woman, was admitted to the inpatient unit from the ER with severe right flank pain unresponsive to analgesics. Her pain did not decrease with administration of 100 mg of IV meperidine. She had a three-month history of chronic UTI. Six months ago, she had been prescribed calcium supplements for low bone density. Her gynecologist warned her that calcium could be a problem for people who are “stone formers”. A.A. was unaware that she might be at risk. An IV urogram showed a right staghorn calculus. The diagnosis was further confirmed by a renal ultrasound. A renal flow scan showed normal perfusion and no obstruction. Kidney function was 37 percent on the right and 63 percent on the left. The pain became intermittent, and A.A. had no hematuria, dysuria, frequency, urgency, or nocturia. Urinalysis revealed no albumin, glucose, bacteria, or blood; there was evidence of cells, crystals, and casts. A.A. was transferred to surgery for a cystoscopic ureteral laser lithotripsy, insertion of a right retrograde ureteral catheter, and right percutaneous nephrolithotomy. A ureteral calculus was fragmented with a pulsed-dye laser. Most of the staghorn was removed from the renal pelvis with no remaining stone in the renal calices. She was discharged two days later and ordered to strain her urine for evidence of stones for the next week . 医学英语基础教程 English for Medical Students and Doctors 180",
    "wordCount": 234,
    "blankCandidates": [
      {
        "answer": "ER",
        "type": "setting",
        "meaning": "急诊室",
        "reason": "core case term",
        "distractors": [
          "right flank pain",
          "analgesics",
          "IV meperidine"
        ]
      },
      {
        "answer": "right flank pain",
        "type": "symptom",
        "meaning": "右侧胁腹痛",
        "reason": "core case term",
        "distractors": [
          "ER",
          "analgesics",
          "IV meperidine"
        ]
      },
      {
        "answer": "analgesics",
        "type": "medication class",
        "meaning": "镇痛药",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "IV meperidine"
        ]
      },
      {
        "answer": "IV meperidine",
        "type": "medication",
        "meaning": "静脉哌替啶",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "chronic UTI",
        "type": "history",
        "meaning": "慢性尿路感染",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "calcium supplements",
        "type": "medication",
        "meaning": "钙补充剂",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "low bone density",
        "type": "condition",
        "meaning": "低骨密度",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "IV urogram",
        "type": "test",
        "meaning": "静脉尿路造影",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "right staghorn calculus",
        "type": "diagnosis",
        "meaning": "右侧鹿角形结石",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "staghorn calculus",
        "type": "diagnosis",
        "meaning": "鹿角形结石",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "renal ultrasound",
        "type": "test",
        "meaning": "肾脏超声",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "renal flow scan",
        "type": "test",
        "meaning": "肾血流扫描",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "normal perfusion",
        "type": "finding",
        "meaning": "灌注正常",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "obstruction",
        "type": "finding",
        "meaning": "梗阻",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "Kidney function",
        "type": "test",
        "meaning": "肾功能",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "intermittent",
        "type": "symptom qualifier",
        "meaning": "间歇性",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "hematuria",
        "type": "symptom",
        "meaning": "血尿",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "dysuria",
        "type": "symptom",
        "meaning": "尿痛/排尿困难",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "frequency",
        "type": "symptom",
        "meaning": "尿频",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "urgency",
        "type": "symptom",
        "meaning": "尿急",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "nocturia",
        "type": "symptom",
        "meaning": "夜尿",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "albumin",
        "type": "test finding",
        "meaning": "白蛋白",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "glucose",
        "type": "test finding",
        "meaning": "葡萄糖",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "bacteria",
        "type": "test finding",
        "meaning": "细菌",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "cells",
        "type": "test finding",
        "meaning": "细胞",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "crystals",
        "type": "test finding",
        "meaning": "结晶",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "casts",
        "type": "test finding",
        "meaning": "管型",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "cystoscopic ureteral laser lithotripsy",
        "type": "procedure",
        "meaning": "膀胱镜输尿管激光碎石术",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "retrograde ureteral catheter",
        "type": "device",
        "meaning": "逆行输尿管导管",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "percutaneous nephrolithotomy",
        "type": "procedure",
        "meaning": "经皮肾镜取石术",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "ureteral calculus",
        "type": "diagnosis",
        "meaning": "输尿管结石",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "pulsed-dye laser",
        "type": "device",
        "meaning": "脉冲染料激光",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "renal pelvis",
        "type": "anatomy",
        "meaning": "肾盂",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "renal calices",
        "type": "anatomy",
        "meaning": "肾盏",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      },
      {
        "answer": "strain her urine",
        "type": "care instruction",
        "meaning": "过滤尿液",
        "reason": "core case term",
        "distractors": [
          "ER",
          "right flank pain",
          "analgesics"
        ]
      }
    ]
  },
  {
    "unit": "Unit7",
    "caseId": "7-2",
    "title": "Artificial Urinary Sphincter Implantation",
    "pages": [
      190,
      191
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Artificial Urinary Sphincter Implantation An 81-year-old male was hospitalized at the Urology ward due to severe urinary incontinence from mixed causes with clear stress-related elements. The urethral dysfunction occurred about 1 year before following the endoscopic cervico-urethral disobstruction operation carried out in another facility. It has to be reported that in July 1993 a surgical operation was carried out in order to correct the sphincteric dysfunction according to Lenzi’s method that provides for a sinking of the urethra in the corpus cavernosum. Despite from this therapeutic attempt, the patient kept showing a severe urinary incontinence mostly orthostatic. Treatment consisted of a conservative therapy with anticholinergic drugs and of a perineal electrostimulation without achieving any appreciable result. Therefore, hospitalization was carried out during which the patient underwent the case evaluations in order to confirm the possibility of an artificial sphincter implantation. Such evaluations gave evidence of a high excretory duct within normal limits; the bladder showed normal capacity in the absence of refluxes and mainly in the absence of residual intravesical obstructions with a complete reservoir emptying. The patient, therefore, underwent surgical operation of Scott’s AMS 800 artificial urinary sphincter implantation at the urethral bulb (4.5 cm cuff; 61—70 cm water balloon; osmolarity of 343 milliosmoles/liter). The postsurgical course was normal except for a small hematoma in the scrotal pump that, however, did not bring about a sphincter inflammation. At the follow-up examination carried out the patient confirmed a perfect continence with good flow and a prosthesis activity which Figure 1 AMS 800 artificial urinary sphicter Figure 2 Implantation of an artificial sphincter to a man (left) and a woman (right) Three components Cuff Pressure regulating balloon Deactivation button Pump bladder bladder cuff urethra activation pump balloon 医学英语基础教程 English for Medical Students and Doctors 182 appeared to be normal. The patient had to compress the pump only once and apparently a good filling of the cuff was reached after miction. In the same occasion a uroflussometry was carried out. It showed a maximum urinary flow 42mL/sec with absent ecograph residue. The two renal parenchymas appeared to be normal without any pyelo-ureteral dilatation.",
    "wordCount": 355,
    "blankCandidates": [
      {
        "answer": "urinary incontinence",
        "type": "diagnosis",
        "meaning": "尿失禁",
        "reason": "core case term",
        "distractors": [
          "continence",
          "urethral dysfunction",
          "sphincteric dysfunction"
        ]
      },
      {
        "answer": "continence",
        "type": "condition",
        "meaning": "控尿",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "urethral dysfunction",
          "sphincteric dysfunction"
        ]
      },
      {
        "answer": "urethral dysfunction",
        "type": "condition",
        "meaning": "尿道功能障碍",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "sphincteric dysfunction"
        ]
      },
      {
        "answer": "sphincteric dysfunction",
        "type": "condition",
        "meaning": "括约肌功能障碍",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "orthostatic",
        "type": "symptom qualifier",
        "meaning": "直立性",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "anticholinergic drugs",
        "type": "medication class",
        "meaning": "抗胆碱能药物",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "perineal electrostimulation",
        "type": "treatment",
        "meaning": "会阴电刺激",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "sphincter implantation",
        "type": "procedure",
        "meaning": "括约肌植入术",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "artificial urinary sphincter",
        "type": "device",
        "meaning": "人工尿道括约肌",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "urinary sphincter",
        "type": "anatomy",
        "meaning": "尿道括约肌",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "urethral bulb",
        "type": "anatomy",
        "meaning": "尿道球部",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "cuff",
        "type": "device",
        "meaning": "袖套",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "hematoma",
        "type": "complication",
        "meaning": "血肿",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "scrotal pump",
        "type": "device",
        "meaning": "阴囊泵",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "pump",
        "type": "device",
        "meaning": "泵",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "follow-up examination",
        "type": "follow-up",
        "meaning": "随访检查",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "prosthesis",
        "type": "device",
        "meaning": "假体",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "miction",
        "type": "process",
        "meaning": "排尿",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "uroflussometry",
        "type": "test",
        "meaning": "尿流率测定",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "renal parenchymas",
        "type": "anatomy",
        "meaning": "肾实质",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      },
      {
        "answer": "pyelo-ureteral dilatation",
        "type": "finding",
        "meaning": "肾盂输尿管扩张",
        "reason": "core case term",
        "distractors": [
          "urinary incontinence",
          "continence",
          "urethral dysfunction"
        ]
      }
    ]
  },
  {
    "unit": "Unit8",
    "caseId": "8-1",
    "title": "Cushing’s Syndrome in a Child",
    "pages": [
      217,
      218
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Cushing’s Syndrome in a Child A 4 years old boy presented with complaints of excessive weight gain of 5 months duration and increased frequency of micturition and appearance of body hair for 4 months. There was no history of any other illness, medication or steroid intake. The child was first born at term by normal vaginal delivery and birth weight of 3 kg. Physical examination revealed a chubby boy with moon face, buffalo hump, protruding abdomen, increased body hair and appearance of coarse pubic hair. His intelligent quotient was appropriate for his age and sex. His younger sibling was in good health and other family members did not have any metabolic or similar problems. The patient’s body length was 92 cm, weight 20 kg, and BMI was 23.6. His blood pressure on right arm in lying position was 138/76mm Hg. Cushing’s syndrome is a rare entity in children. Adrenal tumor is the common cause of this syndrome in young children, whereas, iatrogenic causes are more common among older children. This 4-year-old male child was diagnosed with Cushing’s syndrome due to a right adrenal adenoma; the child presented with obesity and increase distribution of body hair. After thorough investigation and control of hypertension and dyselectrolytemia, right adrenalectomy was performed. The patient had good clinical recovery with weight loss and biochemical resolution of Cushing’s syndrome.",
    "wordCount": 226,
    "blankCandidates": [
      {
        "answer": "excessive weight gain",
        "type": "symptom",
        "meaning": "体重过度增加",
        "reason": "core case term",
        "distractors": [
          "micturition",
          "steroid intake",
          "chubby"
        ]
      },
      {
        "answer": "micturition",
        "type": "process",
        "meaning": "排尿",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "steroid intake",
          "chubby"
        ]
      },
      {
        "answer": "steroid intake",
        "type": "history",
        "meaning": "类固醇摄入",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "chubby"
        ]
      },
      {
        "answer": "chubby",
        "type": "sign",
        "meaning": "肥胖的",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "moon face",
        "type": "sign",
        "meaning": "满月脸",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "buffalo hump",
        "type": "sign",
        "meaning": "水牛背",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "protruding abdomen",
        "type": "sign",
        "meaning": "腹部膨隆",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "coarse pubic hair",
        "type": "sign",
        "meaning": "粗硬阴毛",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "metabolic",
        "type": "descriptor",
        "meaning": "代谢的",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "Cushing’s syndrome",
        "type": "diagnosis",
        "meaning": "库欣综合征",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "iatrogenic",
        "type": "cause",
        "meaning": "医源性的",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "adrenal adenoma",
        "type": "diagnosis",
        "meaning": "肾上腺腺瘤",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "hypertension",
        "type": "condition",
        "meaning": "高血压",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "dyselectrolytemia",
        "type": "condition",
        "meaning": "电解质紊乱",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "adrenalectomy",
        "type": "procedure",
        "meaning": "肾上腺切除术",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      },
      {
        "answer": "biochemical resolution",
        "type": "course",
        "meaning": "生化异常缓解",
        "reason": "core case term",
        "distractors": [
          "excessive weight gain",
          "micturition",
          "steroid intake"
        ]
      }
    ]
  },
  {
    "unit": "Unit8",
    "caseId": "8-2",
    "title": "Parathyroidectomy",
    "pages": [
      218,
      219,
      220
    ],
    "source": "医学英语基础教程..pdf",
    "text": "Parathyroidectomy The case pertains to a 42-year-old Caucasian female patient, who was admitted in our department due to general weakness, along with incidents of vague abdominal pain for the past 8 months. Her medical history included 2 Cesarean sections, and she was a periodical smoker. Physical examination was proven unremarkable. A complete laboratory scan was performed, which demonstrated normal hematocrit and hemoglobin values. Her thyroid hormones revealed an euthyroid state, with TSH, T3 and T4 being within normal limits. Parathormone was 151 pg/mL while serum calcium was detected at the highest normal levels for our laboratory (10.4 mg/dL with a normal range of 8.1–10.5 mg/dL), thus setting the basis for the diagnosis of normocalcemic hyperparathyroidism. Rest of her biochemistry results was 医学英语基础教程 English for Medical Students and Doctors 210 insignificant. An ultrasound scan of her neck revealed a normal sized thyroid gland, while an enlarged parathyroid was located on the left lower side of her cervical region, with its dimensions approximately 3×2 cm. Further examination with 99 m Tc-MIBI parathyroid scintigraphy depicted large concentrations of radiotracer on the same location, signifying a possible parathyroid adenoma as the cause of her hyperparathyroidism (Fig. 1). After signing written consent, the patient was taken to the operating room. Resection of the giant gland was performed by a general surgeon experienced in thyroid surgery through implementation of minimal invasive parathyroidectomy (MIP). A small left-sided thyroid incision was performed, approximately 2 cm in length. After lateral retraction of the sternothyroid muscle and manipulation of the left thyroid lobe, the gross parathyroid adenoma was located, attached on the posterior side of the left lower lobe of her thyroid (Fig. 2). Careful resection of the gland was performed with identification of the left recurrent laryngeal nerve. The excised specimen was sent for pathologic examination, which was indeed significant for a giant 3 × 2 cm parathyroid adenoma (Fig. 3). Figure 1. 99m Tc-MIBI parathyroid s c i n t i g r a p h y d e m o n s t r a t e d increased radiotracer absorption from the lower left parathyroid gland. Figure 3. Excised s p e c i m e n o f a giant 3 × 2 cm p a r a t h y r o i d adenoma Figure 2. A giant parathyroid adenoma resected through implementation of minimally invasive parathyroidectomy. The gland was removed through a small left-sided thyroid incision. The postoperative period was uneventful for the patient, with a slight decline in calcium (9.5 mg/ dL), and her parathormone (PHT) levels returned within normal limits approximately 8 hours after surgery. She was discharged on the next day, while at 3 month follow up she reported no further symptoms.",
    "wordCount": 459,
    "blankCandidates": [
      {
        "answer": "general weakness",
        "type": "symptom",
        "meaning": "全身乏力",
        "reason": "core case term",
        "distractors": [
          "vague abdominal pain",
          "Cesarean sections",
          "laboratory scan"
        ]
      },
      {
        "answer": "vague abdominal pain",
        "type": "symptom",
        "meaning": "隐约腹痛",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "Cesarean sections",
          "laboratory scan"
        ]
      },
      {
        "answer": "Cesarean sections",
        "type": "history",
        "meaning": "剖宫产",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "laboratory scan"
        ]
      },
      {
        "answer": "laboratory scan",
        "type": "test",
        "meaning": "实验室检查",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "hematocrit",
        "type": "test",
        "meaning": "红细胞压积",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "hemoglobin",
        "type": "test",
        "meaning": "血红蛋白",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "thyroid hormones",
        "type": "test",
        "meaning": "甲状腺激素",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "euthyroid state",
        "type": "finding",
        "meaning": "甲状腺功能正常状态",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "TSH",
        "type": "hormone",
        "meaning": "促甲状腺激素",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "T3",
        "type": "hormone",
        "meaning": "T3",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "T4",
        "type": "hormone",
        "meaning": "T4",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "normal limits",
        "type": "finding",
        "meaning": "正常范围",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "serum calcium",
        "type": "test",
        "meaning": "血清钙",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "calcium",
        "type": "substance",
        "meaning": "钙",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "normocalcemic hyperparathyroidism",
        "type": "diagnosis",
        "meaning": "正常血钙性甲状旁腺功能亢进",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "hyperparathyroidism",
        "type": "diagnosis",
        "meaning": "甲状旁腺功能亢进",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "parathyroid",
        "type": "anatomy",
        "meaning": "甲状旁腺",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "biochemistry results",
        "type": "test",
        "meaning": "生化结果",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "ultrasound scan",
        "type": "test",
        "meaning": "超声检查",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "thyroid gland",
        "type": "anatomy",
        "meaning": "甲状腺",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "cervical region",
        "type": "anatomy",
        "meaning": "颈部区域",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "MIBI",
        "type": "test",
        "meaning": "MIBI显像",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "parathyroid scintigraphy",
        "type": "test",
        "meaning": "甲状旁腺闪烁扫描",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "radiotracer",
        "type": "substance",
        "meaning": "放射性示踪剂",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "parathyroid adenoma",
        "type": "diagnosis",
        "meaning": "甲状旁腺腺瘤",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "operating room",
        "type": "setting",
        "meaning": "手术室",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "thyroid surgery",
        "type": "procedure",
        "meaning": "甲状腺手术",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "thyroid incision",
        "type": "procedure",
        "meaning": "甲状腺切口",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "lateral retraction",
        "type": "procedure",
        "meaning": "向外牵拉",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "sternothyroid muscle",
        "type": "anatomy",
        "meaning": "胸骨甲状肌",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "left thyroid lobe",
        "type": "anatomy",
        "meaning": "左甲状腺叶",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "recurrent laryngeal nerve",
        "type": "anatomy",
        "meaning": "喉返神经",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "excised specimen",
        "type": "specimen",
        "meaning": "切除标本",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "pathologic examination",
        "type": "test",
        "meaning": "病理检查",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "minimally invasive parathyroidectomy",
        "type": "procedure",
        "meaning": "微创甲状旁腺切除术",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "parathormone",
        "type": "hormone",
        "meaning": "甲状旁腺激素",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      },
      {
        "answer": "follow up",
        "type": "clinical process",
        "meaning": "随访",
        "reason": "core case term",
        "distractors": [
          "general weakness",
          "vague abdominal pain",
          "Cesarean sections"
        ]
      }
    ]
  }
];
