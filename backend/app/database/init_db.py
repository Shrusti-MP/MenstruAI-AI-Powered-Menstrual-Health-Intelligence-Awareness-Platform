from sqlalchemy.orm import Session
from sqlalchemy import inspect, text
from app.database.base import Base
from app.database.session import engine
from app.models.user import User, Profile, PrivacyConsent
from app.models.tracking import Symptom
from app.models.education import EducationalContent, MythFact
from app.models.quiz import QuizQuestion, QuizOption, QuizAttemptQuestion
from app.auth.security import hash_password
from app.database.education_data import EDUCATIONAL_ARTICLES
from app.database.quiz_data import QUIZ_QUESTION_BANK


def migrate_schema(engine_instance):
    """Safely migrate tables and add missing columns if needed."""
    try:
        inspector = inspect(engine_instance)
        table_names = inspector.get_table_names()

        if "quiz_questions" in table_names:
            columns = [c["name"] for c in inspector.get_columns("quiz_questions")]
            with engine_instance.connect() as conn:
                if "difficulty" not in columns:
                    conn.execute(text("ALTER TABLE quiz_questions ADD COLUMN difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium'"))
                if "question_type" not in columns:
                    conn.execute(text("ALTER TABLE quiz_questions ADD COLUMN question_type VARCHAR(50) NOT NULL DEFAULT 'single_choice'"))
                if "is_active" not in columns:
                    conn.execute(text("ALTER TABLE quiz_questions ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT TRUE"))
                conn.commit()
    except Exception as e:
        print(f"[Schema Migration Notice]: {e}")


def init_db(db: Session) -> None:
    # 0. Migrate schema for any new columns
    migrate_schema(engine)

    # Create all tables in database if not already created
    Base.metadata.create_all(bind=engine)

    # 1. Predefined Symptoms
    symptoms_data = [
        {"name": "Cramps", "category": "Physical", "description": "Abdominal or pelvic cramping caused by uterine muscle contractions."},
        {"name": "Headache", "category": "Neurological", "description": "Tension headaches or migraines related to hormonal shifts."},
        {"name": "Fatigue", "category": "Systemic", "description": "Noticeable tiredness or low energy levels across cycle phases."},
        {"name": "Bloating", "category": "Gastrointestinal", "description": "Abdominal fullness or water retention before or during bleeding."},
        {"name": "Mood Changes", "category": "Emotional", "description": "Shifts in mood, sensitivity, anxiety, or irritability."},
        {"name": "Back Pain", "category": "Musculoskeletal", "description": "Dull or aching discomfort in the lower lumbar region."},
        {"name": "Breast Tenderness", "category": "Physical", "description": "Swelling or hypersensitivity in breast tissue due to progesterone fluctuations."},
    ]

    for item in symptoms_data:
        existing = db.query(Symptom).filter(Symptom.name == item["name"]).first()
        if not existing:
            symptom = Symptom(name=item["name"], category=item["category"], description=item["description"])
            db.add(symptom)

    # Normalize any legacy categories to the 15 standard categories
    legacy_map = {
        'Common Symptoms': 'Common Menstrual Symptoms',
        'FAQs': 'Common Questions',
        'Menstrual Hygiene': 'Period Hygiene',
        'Nutrition & Lifestyle': 'Nutrition and Hydration',
        'PMS': 'Mood and Emotional Well-being',
        'Sleep': 'Sleep and Menstrual Health',
    }
    for old_c, new_c in legacy_map.items():
        db.query(EducationalContent).filter(EducationalContent.category == old_c).update({"category": new_c})

    # 2. Comprehensive Educational Articles (85 articles across 15 categories)
    for item in EDUCATIONAL_ARTICLES:
        existing = db.query(EducationalContent).filter(EducationalContent.title == item["title"]).first()
        if not existing:
            article = EducationalContent(
                title=item["title"],
                category=item["category"],
                short_description=item["short_description"],
                content=item["content"],
                source=item.get("source"),
                source_url=item.get("source_url"),
            )
            db.add(article)
        else:
            # Upgrade existing article fields
            existing.category = item["category"]
            existing.short_description = item["short_description"]
            existing.content = item["content"]
            existing.source = item.get("source")
            existing.source_url = item.get("source_url")

    # 3. Myths vs Facts
    myths_data = [
        {
            "myth": "You cannot exercise or swim while on your period.",
            "fact": "Exercise and swimming are completely safe and often beneficial during menstruation.",
            "explanation": "Physical activity stimulates circulation and triggers the release of endorphins (the body's natural analgesics), which can alleviate pelvic cramping and enhance mood. Tampons or menstrual cups make swimming hygienic and comfortable.",
            "source": "American College of Sports Medicine",
            "source_url": "https://www.acsm.org",
        },
        {
            "myth": "Menstrual blood is 'dirty' or toxic waste that your body is expelling.",
            "fact": "Menstrual fluid is not toxic waste; it consists of normal blood, cervical mucus, and mucosal tissue from the uterine lining.",
            "explanation": "The uterus builds a nutrient-dense endometrial lining each month to support potential pregnancy. When pregnancy does not occur, this tissue sheds naturally. It carries no unique toxins compared to ordinary blood.",
            "source": "Mayo Clinic Women's Health",
            "source_url": "https://www.mayoclinic.org",
        },
        {
            "myth": "Every healthy person has an exact 28-day menstrual cycle.",
            "fact": "Normal adult menstrual cycles vary widely, ranging anywhere from 21 to 35 days.",
            "explanation": "The 28-day cycle is merely a population average. Individual cycle lengths vary from person to person and even month to month in response to stress, sleep, travel, or nutritional changes.",
            "source": "World Health Organization",
            "source_url": "https://www.who.int",
        },
        {
            "myth": "Severe, debilitating pain during your period is normal and something you just have to endure.",
            "fact": "Severe pelvic pain that disrupts daily activities is not typical and should be evaluated by a healthcare professional.",
            "explanation": "While mild discomfort is common due to prostaglandin release, severe or disabling pain may indicate underlying medical conditions such as endometriosis, adenomyosis, or fibroids, all of which benefit from early clinical care.",
            "source": "Endometriosis Foundation of America & NHS",
            "source_url": "https://www.endofound.org",
        },
        {
            "myth": "You cannot get pregnant while having your period.",
            "fact": "While the probability is low, pregnancy can still occur from sexual intercourse during menstruation.",
            "explanation": "Sperm can survive in the female reproductive tract for up to 5 days. In individuals with shorter cycles (e.g., 21–24 days), ovulation can occur shortly after menstruation, meaning intercourse during a period could overlap with the fertile window.",
            "source": "ACOG FAQs on Contraception and Fertility",
            "source_url": "https://www.acog.org",
        },
        {
            "myth": "You shouldn't wash your hair or take warm baths during your period.",
            "fact": "Bathing and washing hair during menstruation is completely safe and supports proper hygiene.",
            "explanation": "Warm baths or showers can actually relax pelvic and abdominal muscles, providing comfort from cramps. Maintaining daily bodily cleanliness during bleeding is recommended by all major health organizations.",
            "source": "UNICEF Menstrual Hygiene Guidance",
            "source_url": "https://www.unicef.org",
        },
        {
            "myth": "Using a tampon can cause you to lose your virginity.",
            "fact": "Virginity is a social and personal concept, not a physiological state altered by tampon use.",
            "explanation": "The hymen is a thin, flexible ring of mucous membrane with natural openings to allow menstrual blood flow. Using a tampon may stretch this membrane, but does not affect virginity.",
            "source": "Planned Parenthood Clinical Education",
            "source_url": "https://www.plannedparenthood.org",
        },
        {
            "myth": "You shouldn't talk about periods because they are shameful and private.",
            "fact": "Menstruation is a healthy biological function experienced by over half the global population.",
            "explanation": "Menstrual health education and open conversations reduce stigma, empower individuals to recognize abnormal symptoms early, and foster supportive environments in schools and workplaces.",
            "source": "UNESCO International Technical Guidance on Sexuality Education",
            "source_url": "https://www.unesco.org",
        },
        {
            "myth": "PMS is purely psychological or 'all in your head'.",
            "fact": "PMS has clear biological and neurochemical mechanisms triggered by hormonal fluctuations.",
            "explanation": "Changes in circulating estrogen and progesterone influence serotonin and GABA receptors in the brain, causing genuine physical and affective responses such as water retention, fatigue, and irritability.",
            "source": "Cleveland Clinic",
            "source_url": "https://my.clevelandclinic.org",
        },
    ]

    for item in myths_data:
        existing = db.query(MythFact).filter(MythFact.myth == item["myth"]).first()
        if not existing:
            entry = MythFact(
                myth=item["myth"],
                fact=item["fact"],
                explanation=item["explanation"],
                source=item["source"],
                source_url=item["source_url"],
            )
            db.add(entry)

    # 4. Large Quiz Question Bank (88 Unique Questions Across 12 Categories)
    for q_data in QUIZ_QUESTION_BANK:
        existing_q = db.query(QuizQuestion).filter(QuizQuestion.question == q_data["question"]).first()
        if not existing_q:
            question = QuizQuestion(
                question=q_data["question"],
                category=q_data["category"],
                difficulty=q_data.get("difficulty", "Medium"),
                question_type=q_data.get("question_type", "single_choice"),
                explanation=q_data["explanation"],
                is_active=True,
            )
            db.add(question)
            db.flush()

            for opt_text, is_corr in q_data["options"]:
                option = QuizOption(
                    question_id=question.id,
                    option_text=opt_text,
                    is_correct=is_corr,
                )
                db.add(option)
        else:
            # Update attributes on existing question
            existing_q.category = q_data["category"]
            existing_q.difficulty = q_data.get("difficulty", "Medium")
            existing_q.question_type = q_data.get("question_type", "single_choice")
            existing_q.explanation = q_data["explanation"]
            existing_q.is_active = True

    # 5. Create a Demo User for testing & review demonstration
    demo_email = "demo@menstruai.com"
    existing_demo = db.query(User).filter(User.email == demo_email).first()
    if not existing_demo:
        demo_user = User(
            name="Anya Sharma",
            email=demo_email,
            password_hash=hash_password("Password123!"),
            role="USER",
            is_active=True,
        )
        db.add(demo_user)
        db.flush()

        profile = Profile(user_id=demo_user.id, preferences='{"cycle_goals": "Health awareness & symptom tracking"}')
        privacy = PrivacyConsent(user_id=demo_user.id, consent_given=True, consent_version="1.0")
        db.add(profile)
        db.add(privacy)

    db.commit()
    print("MenstruAI database initialized with full expanded educational library and 88-question bank.")
