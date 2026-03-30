export const surveyQuestions = [
  {
    id: "q1",
    type: "radio",
    title:
      "Iste'molchi huquqlari ko'proq qaysi holatda buziladi deb o'ylaysiz?",
    options: [
      "Sifatsiz mahsulot yoki xizmat taqdim etilganda",
      "Narx va shartlar to'liq tushuntirilmaganda",
      "Kafolat yoki qaytarish qoidalari bajarilmaganda",
      "Onlayn savdoda yolg'on ma'lumot berilganda",
    ],
  },
  {
    id: "q2",
    type: "radio",
    title: "Siz uchun eng katta oqibat qaysi biri hisoblanadi?",
    options: [
      "Moliyaviy zarar",
      "Vaqt yo'qotish",
      "Asabiylashish va ishonch pasayishi",
      "Xizmat yoki mahsulotdan foydalana olmaslik",
    ],
  },
  {
    id: "q3",
    type: "radio",
    title:
      "Tadbirkorlar iste'molchi huquqlarini buzmasligi uchun eng muhim omil nima?",
    options: [
      "Qonuniy nazoratni kuchaytirish",
      "Xodimlarni muntazam o'qitish",
      "Jarimalarni oshirish",
      "Mijozlarga aniq ma'lumot berish",
    ],
  },
  {
    id: "q4",
    type: "radio",
    title:
      "Mahsulot haqida noto'g'ri reklama berilishi sizningcha qaysi darajada xavfli?",
    options: [
      "Juda xavfli",
      "O'rtacha xavfli",
      "Kam xavfli",
      "Xavfli emas",
    ],
  },
  {
    id: "q5",
    type: "radio",
    title:
      "Iste'molchi huquqlarini himoya qilishda kimning roli eng katta bo'lishi kerak?",
    options: [
      "Davlat nazorat organlari",
      "Tadbirkor va xizmat ko'rsatuvchi tashkilotlar",
      "Iste'molchining o'zi",
      "Jamoatchilik va OAV",
    ],
  },
  {
    id: "q6",
    type: "radio",
    title:
      "Shikoyat qilish jarayoni odatda nimasi bilan qiyinlashadi deb o'ylaysiz?",
    options: [
      "Jarayon juda uzunligi bilan",
      "Mas'ullar javob bermasligi bilan",
      "Kerakli hujjatlar ko'pligi bilan",
      "Odamlar huquqlarini bilmasligi bilan",
    ],
  },
  {
    id: "q7",
    type: "text",
    title:
      "Siz kuzatgan yoki eshitgan iste'molchi huquqlarini buzish holatidan bir misol yozing.",
    placeholder: "Misol: mahsulot sifati va'daga mos kelmagan holat...",
  },
  {
    id: "q8",
    type: "radio",
    title:
      "Qaysi yo'nalishda profilaktika ishlari ko'proq natija beradi deb hisoblaysiz?",
    options: [
      "Aholiga huquqiy tushuntirishlar berish",
      "Tadbirkorlar uchun seminarlar o'tkazish",
      "Raqamli nazorat tizimlarini joriy etish",
      "Shikoyat platformalarini soddalashtirish",
    ],
  },
  {
    id: "q9",
    type: "radio",
    title:
      "Onlayn savdoda iste'molchini himoya qilish uchun eng zarur chorani tanlang.",
    options: [
      "Sotuvchi ma'lumotlarini to'liq ochiqlash",
      "To'lovdan oldin to'liq shartlarni ko'rsatish",
      "Yetkazib berish muddatini aniq belgilash",
      "Qaytarish mexanizmini soddalashtirish",
    ],
  },
  {
    id: "q10",
    type: "radio",
    title:
      "Tovar yoki xizmat sifati bo'yicha nizolarni kamaytirishning eng to'g'ri yo'li qaysi?",
    options: [
      "Sifat standartlarini kuchaytirish",
      "Mijoz fikrini doimiy yig'ish",
      "Shartnoma va chek berishni majburiy qilish",
      "Nazorat tekshiruvlarini ko'paytirish",
    ],
  },
  {
    id: "q11",
    type: "radio",
    title:
      "Iste'molchi huquqlarini buzilishidan eng ko'p kim zarar ko'radi deb o'ylaysiz?",
    options: [
      "Oddiy aholi",
      "Talabalar va yoshlar",
      "Keksalar",
      "Onlayn xaridorlar",
    ],
  },
  {
    id: "q12",
    type: "radio",
    title:
      "Agar mahsulot sifatsiz chiqsa, iste'molchi birinchi navbatda nima qilishi kerak?",
    options: [
      "Sotuvchiga murojaat qilishi kerak",
      "Huquqni himoya qiluvchi organga yozishi kerak",
      "Ijtimoiy tarmoqqa joylashi kerak",
      "Chek va dalillarni yig'ib saqlashi kerak",
    ],
  },
  {
    id: "q13",
    type: "text",
    title:
      "Iste'molchi huquqlarini buzish holatlarini oldini olish uchun qanday taklif berasiz?",
    placeholder:
      "Taklifingizni yozing: masalan, nazorat, o'qitish yoki raqamli yechimlar...",
  },
  {
    id: "q14",
    type: "radio",
    title:
      "Huquqiy savodxonlikni oshirish uchun qaysi usul samaraliroq deb hisoblaysiz?",
    options: [
      "Maktab va OTMlarda maxsus darslar",
      "Televideniye va internetda kampaniyalar",
      "Davlat xizmat markazlarida targ'ibot",
      "Mobil ilova va botlar orqali tushuntirish",
    ],
  },
  {
    id: "q15",
    type: "radio",
    title:
      "Umuman olganda, iste'molchi huquqlarini himoya qilish tizimini qanday baholaysiz?",
    options: [
      "Yaxshi ishlayapti",
      "Qisman ishlayapti",
      "Zaif ishlayapti",
      "Jiddiy islohot kerak",
    ],
  },
];

export const surveyQuestionMap = Object.fromEntries(
  surveyQuestions.map((question) => [question.id, question]),
);
