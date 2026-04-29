import { useState, useEffect, useRef } from 'react'
import './oracle.css'

const G = '#c9a84c'
const dg = o => `rgba(201,168,76,${o})`

const ARCANA = [
  { n:0,  rom:'0',     name:"Шут",            key:"начало, доверие, спонтанность, риск",           svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M35 35 Q40 28 38 20 Q36 12 30 10 Q22 9 18 16 Q14 24 18 32 Q22 40 30 44 Q40 48 48 42 Q56 36 54 26 Q52 14 42 8" stroke="${G}" stroke-width="1.2" opacity="0.9"/><circle cx="35" cy="35" r="2.5" fill="${G}" opacity="0.9"/><circle cx="42" cy="8" r="3" stroke="${G}" stroke-width="0.8" opacity="0.55" fill="${dg('0.1')}"/></svg>` },
  { n:1,  rom:'I',     name:"Маг",            key:"воля, мастерство, фокус, действие",             svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M14 32 Q14 20 24 20 Q32 20 35 30 Q38 20 46 20 Q56 20 56 32 Q56 44 46 44 Q38 44 35 34 Q32 44 24 44 Q14 44 14 32Z" stroke="${G}" stroke-width="1.2" opacity="0.9"/><path d="M35 6 L35 62" stroke="${G}" stroke-width="0.5" opacity="0.28"/><circle cx="35" cy="6" r="3" fill="${G}" opacity="0.85"/><circle cx="35" cy="62" r="3" fill="${G}" opacity="0.85"/><circle cx="35" cy="32" r="2" fill="${G}" opacity="0.7"/></svg>` },
  { n:2,  rom:'II',    name:"Жрица",          key:"интуиция, тайна, подсознание, внутренний мир",  svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M48 12 Q34 17 32 30 Q30 45 42 55 Q24 48 20 32 Q18 14 34 8 Q42 6 48 12Z" stroke="${G}" stroke-width="1.2" opacity="0.92" fill="${dg('0.06')}"/><path d="M20 12 L20 58 M50 12 L50 58" stroke="${G}" stroke-width="0.6" opacity="0.28"/><path d="M20 12 Q35 6 50 12" stroke="${G}" stroke-width="0.7" opacity="0.4" fill="none"/></svg>` },
  { n:3,  rom:'III',   name:"Императрица",    key:"изобилие, чувственность, творчество, тело",     svg:`<svg viewBox="0 0 70 70" fill="none"><circle cx="35" cy="26" r="18" stroke="${G}" stroke-width="1.2" opacity="0.92"/><path d="M35 44 L35 60" stroke="${G}" stroke-width="1.2" opacity="0.92"/><path d="M24 54 L46 54" stroke="${G}" stroke-width="1.2" opacity="0.92"/><path d="M25 32 L45 32 L35 16 Z" stroke="${G}" stroke-width="0.8" opacity="0.5" fill="${dg('0.08')}"/><circle cx="35" cy="26" r="3" fill="${G}" opacity="0.7"/></svg>` },
  { n:4,  rom:'IV',    name:"Император",      key:"структура, власть, контроль, стабильность",     svg:`<svg viewBox="0 0 70 70" fill="none"><rect x="13" y="26" width="36" height="36" stroke="${G}" stroke-width="1.2" opacity="0.9"/><path d="M49 26 L58 6 M58 6 L46 10 M58 6 L54 18" stroke="${G}" stroke-width="1.2" opacity="0.9"/><rect x="20" y="33" width="22" height="22" stroke="${G}" stroke-width="0.5" opacity="0.28"/><circle cx="31" cy="44" r="3" fill="${G}" opacity="0.7"/></svg>` },
  { n:5,  rom:'V',     name:"Иерофант",       key:"традиция, система, наставник, ценности",        svg:`<svg viewBox="0 0 70 70" fill="none"><circle cx="35" cy="22" r="12" stroke="${G}" stroke-width="1.2" opacity="0.92"/><path d="M35 34 L35 64" stroke="${G}" stroke-width="1.2" opacity="0.92"/><path d="M35 46 L46 46 M35 57 L43 57" stroke="${G}" stroke-width="1.2" opacity="0.92"/><circle cx="35" cy="22" r="5" stroke="${G}" stroke-width="0.6" opacity="0.4"/><circle cx="35" cy="22" r="2" fill="${G}" opacity="0.8"/></svg>` },
  { n:6,  rom:'VI',    name:"Влюблённые",     key:"выбор, ценности, союз, аутентичность",          svg:`<svg viewBox="0 0 70 70" fill="none"><ellipse cx="35" cy="40" rx="20" ry="18" stroke="${G}" stroke-width="1.1" opacity="0.85"/><path d="M26 40 Q35 32 44 40" stroke="${G}" stroke-width="0.8" opacity="0.5" fill="none"/><path d="M35 6 L35 22 M35 6 L28 13 M35 6 L42 13" stroke="${G}" stroke-width="1.1" opacity="0.9"/><circle cx="35" cy="6" r="2.5" fill="${G}" opacity="0.7"/></svg>` },
  { n:7,  rom:'VII',   name:"Колесница",      key:"победа, движение, дисциплина, воля",            svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M12 8 L58 8 L58 44 Q58 58 35 63 Q12 58 12 44 Z" stroke="${G}" stroke-width="1.2" opacity="0.88" fill="${dg('0.05')}"/><path d="M22 63 L22 70 M48 63 L48 70" stroke="${G}" stroke-width="1" opacity="0.65"/><circle cx="35" cy="32" r="9" stroke="${G}" stroke-width="0.9" opacity="0.5"/><circle cx="35" cy="32" r="3" fill="${G}" opacity="0.9"/></svg>` },
  { n:8,  rom:'VIII',  name:"Сила",           key:"внутренняя сила, терпение, мужество, мягкость", svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M8 35 Q8 18 20 18 Q28 18 35 28 Q42 18 50 18 Q62 18 62 35 Q62 52 50 52 Q42 52 35 42 Q28 52 20 52 Q8 52 8 35Z" stroke="${G}" stroke-width="1.2" opacity="0.9"/><circle cx="35" cy="35" r="4" fill="${dg('0.2')}" stroke="${G}" stroke-width="0.7" opacity="0.6"/><circle cx="35" cy="35" r="2" fill="${G}" opacity="0.95"/></svg>` },
  { n:9,  rom:'IX',    name:"Отшельник",      key:"уединение, мудрость, поиск, интроверсия",       svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M35 8 L35 62" stroke="${G}" stroke-width="1" opacity="0.75"/><ellipse cx="35" cy="22" rx="11" ry="7" stroke="${G}" stroke-width="1.2" opacity="0.9"/><circle cx="35" cy="22" r="3" fill="${G}" opacity="0.9"/><path d="M20 42 L50 42" stroke="${G}" stroke-width="0.8" opacity="0.45"/><path d="M26 52 L35 64 L44 52" stroke="${G}" stroke-width="0.9" opacity="0.5" fill="none"/></svg>` },
  { n:10, rom:'X',     name:"Колесо",         key:"цикл, перемены, судьба, закономерность",        svg:`<svg viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="28" stroke="${G}" stroke-width="1.1" opacity="0.75"/><circle cx="35" cy="35" r="18" stroke="${G}" stroke-width="0.7" opacity="0.4"/><circle cx="35" cy="35" r="7" stroke="${G}" stroke-width="0.8" opacity="0.65"/><circle cx="35" cy="35" r="2.5" fill="${G}" opacity="0.95"/><path d="M35 7 L35 17 M35 53 L35 63 M7 35 L17 35 M53 35 L63 35" stroke="${G}" stroke-width="0.9" opacity="0.65"/><path d="M15 15 L22 22 M48 48 L55 55 M55 15 L48 22 M22 48 L15 55" stroke="${G}" stroke-width="0.6" opacity="0.38"/></svg>` },
  { n:11, rom:'XI',    name:"Справедливость", key:"баланс, ответственность, карма, правда",        svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M35 6 L35 62" stroke="${G}" stroke-width="1" opacity="0.72"/><path d="M12 26 L58 26" stroke="${G}" stroke-width="1.2" opacity="0.95"/><path d="M12 26 Q8 37 12 46 Q16 54 20 46 Q24 37 12 26Z" stroke="${G}" stroke-width="1" opacity="0.85" fill="${dg('0.07')}"/><path d="M58 26 Q54 37 58 46 Q62 54 66 46 Q70 37 58 26Z" stroke="${G}" stroke-width="1" opacity="0.85" fill="${dg('0.07')}"/><path d="M28 57 L42 57 L40 64 L30 64 Z" fill="${dg('0.12')}" stroke="${G}" stroke-width="0.8" opacity="0.7"/></svg>` },
  { n:12, rom:'XII',   name:"Повешенный",     key:"пауза, новая перспектива, жертва, ожидание",    svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M10 12 L60 12" stroke="${G}" stroke-width="1" opacity="0.65"/><path d="M35 12 L35 26" stroke="${G}" stroke-width="1" opacity="0.7"/><path d="M18 26 L52 26 L35 58 Z" stroke="${G}" stroke-width="1.2" opacity="0.92" fill="${dg('0.07')}"/><circle cx="35" cy="63" r="5" stroke="${G}" stroke-width="0.8" opacity="0.45"/><circle cx="35" cy="40" r="2.5" fill="${G}" opacity="0.7"/></svg>` },
  { n:13, rom:'XIII',  name:"Смерть",         key:"трансформация, завершение, переход, обновление",svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M42 6 Q62 22 54 44 Q48 58 30 60 Q16 60 12 48 Q8 34 20 26 Q30 20 40 25 Q50 30 48 44 Q46 54 34 54 Q24 54 22 44" stroke="${G}" stroke-width="1.2" opacity="0.92" fill="none"/><path d="M30 60 L24 70" stroke="${G}" stroke-width="1" opacity="0.7"/><path d="M16 66 L30 70" stroke="${G}" stroke-width="1" opacity="0.7"/><circle cx="42" cy="6" r="2.5" fill="${G}" opacity="0.8"/></svg>` },
  { n:14, rom:'XIV',   name:"Умеренность",    key:"интеграция, баланс, поток, терпение",           svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M14 12 L35 46 L56 12 Z" stroke="${G}" stroke-width="1.1" opacity="0.78" fill="${dg('0.05')}"/><path d="M14 58 L35 24 L56 58 Z" stroke="${G}" stroke-width="1.1" opacity="0.78" fill="${dg('0.05')}"/><circle cx="35" cy="35" r="5" fill="${dg('0.2')}" stroke="${G}" stroke-width="0.8" opacity="0.7"/><circle cx="35" cy="35" r="2" fill="${G}" opacity="0.95"/></svg>` },
  { n:15, rom:'XV',    name:"Дьявол",         key:"тень, зависимость, иллюзия, страх",             svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M35 12 L48 36 L22 36 Z" stroke="${G}" stroke-width="1.1" opacity="0.85" fill="${dg('0.06')}"/><path d="M35 58 L22 34 L48 34 Z" stroke="${G}" stroke-width="1.1" opacity="0.85" fill="${dg('0.06')}"/><path d="M26 9 L20 2 M44 9 L50 2" stroke="${G}" stroke-width="1.1" opacity="0.8"/><path d="M20 2 L26 6 M50 2 L44 6" stroke="${G}" stroke-width="0.7" opacity="0.45"/><circle cx="35" cy="35" r="3.5" fill="${G}" opacity="0.9"/></svg>` },
  { n:16, rom:'XVI',   name:"Башня",          key:"разрушение, прозрение, кризис, освобождение",   svg:`<svg viewBox="0 0 70 70" fill="none"><rect x="23" y="14" width="24" height="44" rx="1" stroke="${G}" stroke-width="1.2" opacity="0.88"/><path d="M23 14 Q35 6 47 14" stroke="${G}" stroke-width="0.9" opacity="0.6" fill="none"/><path d="M8 20 L23 24 M62 18 L47 24" stroke="${G}" stroke-width="1.2" opacity="0.9"/><circle cx="7" cy="18" r="3.5" fill="${G}" opacity="0.8"/><circle cx="63" cy="16" r="3.5" fill="${G}" opacity="0.8"/></svg>` },
  { n:17, rom:'XVII',  name:"Звезда",         key:"надежда, исцеление, вдохновение, ориентир",     svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M35 6 L38 28 L60 28 L43 41 L50 63 L35 50 L20 63 L27 41 L10 28 L32 28 Z" stroke="${G}" stroke-width="1.2" opacity="0.9" fill="${dg('0.07')}"/><circle cx="35" cy="36" r="6" stroke="${G}" stroke-width="0.7" opacity="0.5" fill="${dg('0.1')}"/><circle cx="35" cy="36" r="2.5" fill="${G}" opacity="0.95"/></svg>` },
  { n:18, rom:'XVIII', name:"Луна",           key:"иллюзия, тревога, подсознание, страх",          svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M50 12 Q34 17 32 32 Q30 47 44 56 Q26 50 20 34 Q16 14 32 7 Q42 4 50 12Z" stroke="${G}" stroke-width="1.2" opacity="0.95" fill="${dg('0.07')}"/><circle cx="20" cy="50" r="2.5" fill="${G}" opacity="0.5"/><circle cx="32" cy="60" r="2.5" fill="${G}" opacity="0.5"/><circle cx="46" cy="62" r="2.5" fill="${G}" opacity="0.5"/></svg>` },
  { n:19, rom:'XIX',   name:"Солнце",         key:"радость, витальность, ясность, успех",          svg:`<svg viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="16" stroke="${G}" stroke-width="1.3" opacity="0.95"/><circle cx="35" cy="35" r="8" fill="${dg('0.15')}" stroke="${G}" stroke-width="0.7" opacity="0.55"/><circle cx="35" cy="35" r="3" fill="${G}" opacity="0.95"/><path d="M35 6 L35 15 M35 55 L35 64 M6 35 L15 35 M55 35 L64 35 M14 14 L21 21 M49 49 L56 56 M56 14 L49 21 M21 49 L14 56" stroke="${G}" stroke-width="1.1" opacity="0.78"/></svg>` },
  { n:20, rom:'XX',    name:"Суд",            key:"пробуждение, призыв, прощение, переоценка",     svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M35 6 L64 56 L6 56 Z" stroke="${G}" stroke-width="1.2" opacity="0.88" fill="${dg('0.05')}"/><ellipse cx="35" cy="40" rx="13" ry="8" stroke="${G}" stroke-width="1.1" opacity="0.9"/><circle cx="35" cy="40" r="5" fill="${dg('0.2')}" stroke="${G}" stroke-width="0.7" opacity="0.65"/><circle cx="35" cy="40" r="2" fill="${G}" opacity="0.98"/></svg>` },
  { n:21, rom:'XXI',   name:"Мир",            key:"завершение, целостность, интеграция, успех",    svg:`<svg viewBox="0 0 70 70" fill="none"><path d="M35 8 Q58 8 62 28 Q66 50 48 60 Q32 68 18 58 Q4 46 8 26 Q12 8 35 8" stroke="${G}" stroke-width="1.3" opacity="0.95" fill="none"/><path d="M35 8 Q30 4 28 8 Q32 13 35 8Z" fill="${G}" opacity="0.85"/><ellipse cx="35" cy="35" rx="10" ry="14" stroke="${G}" stroke-width="0.6" opacity="0.35"/><circle cx="35" cy="35" r="2.5" fill="${G}" opacity="0.9"/><circle cx="13" cy="16" r="2.5" fill="${G}" opacity="0.45"/><circle cx="57" cy="16" r="2.5" fill="${G}" opacity="0.45"/><circle cx="13" cy="55" r="2.5" fill="${G}" opacity="0.45"/><circle cx="57" cy="55" r="2.5" fill="${G}" opacity="0.45"/></svg>` },
]

const BACK_SVG = `<svg viewBox="0 0 70 70" fill="none"><circle cx="35" cy="35" r="30" stroke="#c9a84c" stroke-width="0.5" opacity="0.25"/><circle cx="35" cy="35" r="22" stroke="#c9a84c" stroke-width="0.5" opacity="0.35"/><circle cx="35" cy="35" r="14" stroke="#c9a84c" stroke-width="0.5" opacity="0.25"/><path d="M35 5 L37.5 30 L62 32.5 L37.5 35 L35 60 L32.5 35 L8 32.5 L32.5 30 Z" fill="#c9a84c" opacity="0.5"/><path d="M13 13 L30 32 L13 51 L32 34 L51 51 L34 32 L51 13 L32 30 Z" fill="#c9a84c" opacity="0.15"/><circle cx="35" cy="32.5" r="4" stroke="#c9a84c" stroke-width="0.8" opacity="0.6"/><circle cx="35" cy="32.5" r="1.5" fill="#c9a84c" opacity="0.8"/></svg>`

const SHADOW_VOICES = {
  0:{name:'Тень Шута',tone:'Говори саркастично, парадоксами. Видишь абсурд там где другие видят трагедию.'},
  1:{name:'Тень Мага',tone:'Говори точно и требовательно. Ты знаешь что человек не использует свою силу — называй это прямо.'},
  2:{name:'Тень Жрицы',tone:'Говори туманно, образами, намёками. Задавай вопросы которые открывают то что человек прячет.'},
  3:{name:'Тень Императрицы',tone:'Говори чувственно и прямо о желаниях которые человек игнорирует.'},
  4:{name:'Тень Императора',tone:'Говори властно, холодно, с логикой системы. Указывай на страх потери контроля без жалости.'},
  5:{name:'Тень Иерофанта',tone:'Говори как разочарованный наставник. Называй убеждения в которых человек застрял.'},
  6:{name:'Тень Влюблённых',tone:'Говори о страхе выбора и предательстве себя.'},
  7:{name:'Тень Колесницы',tone:'Говори о контроле который стал тюрьмой.'},
  8:{name:'Тень Силы',tone:'Говори мягко но неотвратимо. Ты знаешь где человек силён снаружи но слаб внутри.'},
  9:{name:'Тень Отшельника',tone:'Говори из глубокого молчания. Одиночество стало побегом а не мудростью.'},
  10:{name:'Тень Колеса',tone:'Называй повторяющиеся паттерны которые человек не замечает.'},
  11:{name:'Тень Справедливости',tone:'Говори как судья. Ты знаешь где человек обвиняет других чтобы не смотреть на себя.'},
  12:{name:'Тень Повешенного',tone:'Говори медленно с паузами. Пауза которую человек переживает — это его выбор.'},
  13:{name:'Тень Смерти',tone:'Говори спокойно и неотвратимо. Человек держится за то что уже умерло.'},
  14:{name:'Тень Умеренности',tone:'Говори о крайностях за которыми человек прячется от интеграции.'},
  15:{name:'Тень Дьявола',tone:'Говори соблазнительно. Ты знаешь желания человека лучше него.'},
  16:{name:'Тень Башни',tone:'Твой язык сух и прямой. Разрушай ложные конструкции без жалости. Эвфемизмов нет.'},
  17:{name:'Тень Звезды',tone:'Говори о надежде которая стала бегством от реальности.'},
  18:{name:'Тень Луны',tone:'Говори образами и страхами. Называй иллюзию которую человек принимает за реальность.'},
  19:{name:'Тень Солнца',tone:'Говори о тени за яркостью. Что прячет демонстрируемая радость.'},
  20:{name:'Тень Суда',tone:'Говори о призыве которого человек боится услышать.'},
  21:{name:'Тень Мира',tone:'Говори о завершении которого человек боится.'},
}

const I18N = {
  RU:{
    eyebrow:'Психологический расклад',sub:'Архетипы · Психоанализ · Тень',
    labelQ:'Твой вопрос',placeholder:'О чём ты хочешь ясности прямо сейчас?...',
    btnStart:'✦  Открыть расклад',errFill:'Напиши свой вопрос',
    cardsTitle:'Выбор карт',cardsSub:'Остановись. Сделай вдох.<br/>Три карты — три аспекта ситуации.',
    btnReveal:'✦  Получить расклад',
    loading:['Оракул читает архетипы','Архетипы говорят','Обнажается структура'],
    positions:['Прошлое','Настоящее','Потенциал'],
    shadowLabel:'Вопрос для твоей тени',
    btnStory:'Картинка для Сторис',btnCopy:'Скопировать текст',
    btnShadowCta:'Аудиенция с Тенью',btnShadowSub:'Диалог с архетипом · Цифровой слепок',
    btnRestart:'Новый расклад',
    imprintLabel:'✦  Цифровой слепок тени  ✦',
    imprintResource:'Скрытый ресурс',imprintBlock:'Системный блок',imprintGrowth:'Следующая точка роста',
    btnShareImprint:'Картинка для Сторис',btnCopyImprint:'Скопировать',
    btnGetImprint:'🌑  Получить Цифровой Слепок',btnShareDialog:'Поделиться диалогом',
    blockLabels:{grid:'The Grid · Архитектура',blind:'Blind Spot · Слепая зона',action:'The Action · Импульс'}
  },
  KZ:{
    eyebrow:'Психологиялық ашылу',sub:'Архетиптер · Психоанализ · Көлеңке',
    labelQ:'Сенің сұрағың',placeholder:'Қазір не туралы түсінік алғың келеді?...',
    btnStart:'✦  Ашылуды бастау',errFill:'Сұрақ жаз',
    cardsTitle:'Карталарды таңдау',cardsSub:'Тоқта. Дем ал.<br/>Үш карта — жағдайдың үш қыры.',
    btnReveal:'✦  Ашылуды алу',
    loading:['Оракул архетиптерді оқиды','Архетиптер сөйлейді','Құрылым ашылуда'],
    positions:['Өткен','Қазіргі','Потенциал'],
    shadowLabel:'Көлеңкеңе арналған сұрақ',
    btnStory:'Стористе бөлісу',btnCopy:'Мәтінді көшіру',
    btnShadowCta:'Көлеңкемен аудиенция',btnShadowSub:'Архетипімен диалог · Цифрлық із',
    btnRestart:'Жаңа ашылу',
    imprintLabel:'✦  Көлеңкенің цифрлық ізі  ✦',
    imprintResource:'Жасырын ресурс',imprintBlock:'Жүйелік блок',imprintGrowth:'Келесі өсу нүктесі',
    btnShareImprint:'Стористе бөлісу',btnCopyImprint:'Көшіру',
    btnGetImprint:'🌑  Цифрлық із алу',btnShareDialog:'Диалогты бөлісу',
    blockLabels:{grid:'The Grid · Архитектура',blind:'Blind Spot · Соқыр нүкте',action:'The Action · Импульс'}
  },
  EN:{
    eyebrow:'Psychological Reading',sub:'Archetypes · Psychoanalysis · Shadow',
    labelQ:'Your question',placeholder:'What do you need clarity on right now?...',
    btnStart:'✦  Open the reading',errFill:'Enter your question',
    cardsTitle:'Choose your cards',cardsSub:'Pause. Breathe.<br/>Three cards — three aspects.',
    btnReveal:'✦  Get your reading',
    loading:['The Oracle reads archetypes','Archetypes are speaking','Structure is emerging'],
    positions:['Past','Present','Potential'],
    shadowLabel:'Your shadow work question',
    btnStory:'Share to Stories',btnCopy:'Copy text',
    btnShadowCta:'Shadow Audience',btnShadowSub:'Archetype dialogue · Digital imprint',
    btnRestart:'New reading',
    imprintLabel:'✦  Digital Shadow Imprint  ✦',
    imprintResource:'Hidden resource',imprintBlock:'Systemic block',imprintGrowth:'Next growth point',
    btnShareImprint:'Share to Stories',btnCopyImprint:'Copy',
    btnGetImprint:'🌑  Get Digital Imprint',btnShareDialog:'Share dialogue',
    blockLabels:{grid:'The Grid · Architecture',blind:'Blind Spot',action:'The Action · Impulse'}
  }
}

const SHADOW_MAX = 5

function highlightCardNames(text) {
  const names = [...ARCANA.map(c=>c.name)].sort((a,b)=>b.length-a.length)
  let result = text
  names.forEach(name=>{result=result.replace(new RegExp(`(${name})`,'gi'),`<span class="card-highlight">$1</span>`)})
  return result
}

function parseResponse(raw) {
  const ex=(tag,next)=>{const m=raw.match(new RegExp(`##${tag}##\\s*([\\s\\S]*?)(?=##${next}##|$)`,'i'));return m?m[1].trim():''}
  return{grid:ex('GRID','BLIND'),blind:ex('BLIND','ACTION'),action:ex('ACTION','SHADOW'),shadow:ex('SHADOW','XXXXEND')}
}

function StreamText({text,delay=0,speed=18}){
  const [displayed,setDisplayed]=useState('')
  useEffect(()=>{
    if(!text)return
    const highlighted=highlightCardNames(text)
    let i=0
    const timer=setTimeout(()=>{
      const interval=setInterval(()=>{i+=3;if(i>=highlighted.length){setDisplayed(highlighted);clearInterval(interval);return}setDisplayed(highlighted.slice(0,i))},speed)
      return()=>clearInterval(interval)
    },delay)
    return()=>clearTimeout(timer)
  },[text,delay])
  return <span dangerouslySetInnerHTML={{__html:displayed}}/>
}

const SIGIL=(size=76)=>(
  <svg width={size} height={size} viewBox="0 0 76 76" fill="none">
    <circle cx="38" cy="38" r="35" stroke="#c9a84c" strokeWidth="0.5" opacity="0.28"/>
    <circle cx="38" cy="38" r="25" stroke="#c9a84c" strokeWidth="0.5" opacity="0.45"/>
    <circle cx="38" cy="38" r="15" stroke="#c9a84c" strokeWidth="0.4" opacity="0.3"/>
    <path d="M38 5 L40 34 L69 36 L40 38 L38 67 L36 38 L7 36 L36 34 Z" fill="#c9a84c" opacity="0.55"/>
    <path d="M17 17 L34 36 L17 55 L36 38 L55 55 L38 36 L55 17 L36 34 Z" fill="#c9a84c" opacity="0.18"/>
    <circle cx="38" cy="36" r="3.5" fill="#c9a84c" opacity="0.9"/>
  </svg>
)

export default function App(){
  const [lang,setLangState]=useState('RU')
  const [screen,setScreen]=useState('welcome')
  const [question,setQuestion]=useState('')
  const [selectedCards,setSelectedCards]=useState([])
  const [shuffledDeck,setShuffledDeck]=useState([])
  const [loadingText,setLoadingText]=useState('')
  const [result,setResult]=useState(null)
  const [resultCards,setResultCards]=useState([])
  const [error,setError]=useState('')
  const [toast,setToast]=useState('')
  const [shadowHistory,setShadowHistory]=useState([])
  const [shadowIteration,setShadowIteration]=useState(0)
  const [shadowVoiceName,setShadowVoiceName]=useState('')
  const [shadowDominantIdx,setShadowDominantIdx]=useState(null)
  const [shadowInput,setShadowInput]=useState('')
  const [shadowMessages,setShadowMessages]=useState([])
  const [shadowTyping,setShadowTyping]=useState(false)
  const [shadowDone,setShadowDone]=useState(false)
  const [imprint,setImprint]=useState(null)
  const chatRef=useRef(null)
  const shuffleTimer=useRef(null)
  const t=I18N[lang]

  const stars=Array.from({length:60},(_,i)=>({id:i,top:Math.random()*100,left:Math.random()*100,size:Math.random()<0.12?2:1,dur:2+Math.random()*4,delay:Math.random()*5,minOp:0.05+Math.random()*0.08,maxOp:0.25+Math.random()*0.45}))

  function showToast(msg){setToast(msg);setTimeout(()=>setToast(''),2800)}
  function setLang(l){setLangState(l)}
  function buildDeck(){setShuffledDeck([...ARCANA].sort(()=>Math.random()-0.5))}

  useEffect(()=>{
    if(screen!=='cards')return
    shuffleTimer.current=setInterval(()=>{
      if(selectedCards.length===3)return
      setShuffledDeck(prev=>{
        const next=[...prev]
        const unsel=next.filter(c=>!selectedCards.includes(c.n))
        if(unsel.length<2)return prev
        const ai=next.indexOf(unsel[Math.floor(Math.random()*unsel.length)])
        const bi=next.indexOf(unsel[Math.floor(Math.random()*unsel.length)])
        if(ai!==bi)[next[ai],next[bi]]=[next[bi],next[ai]]
        return next
      })
    },4000)
    return()=>clearInterval(shuffleTimer.current)
  },[screen,selectedCards])

  useEffect(()=>{if(chatRef.current)chatRef.current.scrollTop=chatRef.current.scrollHeight},[shadowMessages,shadowTyping])

  function startReading(){
    if(!question.trim()){setError(t.errFill);return}
    setError('');setSelectedCards([]);buildDeck();setScreen('cards')
  }

  function toggleCard(idx){
    if(selectedCards.includes(idx))setSelectedCards(prev=>prev.filter(i=>i!==idx))
    else if(selectedCards.length<3)setSelectedCards(prev=>[...prev,idx])
  }

  async function revealCards(){
    if(selectedCards.length!==3)return
    clearInterval(shuffleTimer.current)
    setScreen('loading')
    const pos=t.positions
    const cards=selectedCards.map((idx,i)=>({...ARCANA[idx],position:pos[i]}))
    setResultCards(cards)
    const msgs=t.loading;let li=0
    setLoadingText(msgs[0])
    const lt=setInterval(()=>{li=(li+1)%msgs.length;setLoadingText(msgs[li])},2000)
    const cardStr=cards.map(c=>`${c.position}: «${c.name}» [${c.key}]`).join(' | ')
    try{
      const res=await fetch('/api/oracle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question,cards:cardStr,lang})})
      clearInterval(lt)
      if(!res.ok){const e=await res.json();throw new Error(e.error||`HTTP ${res.status}`)}
      const data=await res.json()
      setResult(parseResponse(data.result))
      setScreen('result')
    }catch(e){clearInterval(lt);setScreen('welcome');setError(`Ошибка: ${e.message}`)}
  }

  async function startShadowAudience(){
    const domCard=resultCards[2]||resultCards[0]
    const idx=domCard?.n??16
    setShadowDominantIdx(idx)
    setShadowIteration(0);setShadowHistory([]);setShadowMessages([])
    setShadowInput('');setShadowDone(false);setImprint(null)
    setScreen('shadow')
    await callShadow([],0,idx,true)
  }

  async function callShadow(history,iteration,cardIdx,isOpening=false){
    setShadowTyping(true)
    const cards=resultCards.map(c=>c.name).join(', ')
    const shadowQ=result?.shadow||''
    try{
      const res=await fetch('/api/shadow',{
        method:'POST',headers:{'Content-Type':'application/json'},
        body:JSON.stringify({cardIndex:cardIdx??shadowDominantIdx,history:isOpening?[]:history,shadowQuestion:shadowQ,cards,lang,iteration,maxIterations:SHADOW_MAX})
      })
      const data=await res.json()
      const reply=data.result||''
      const vname=data.voiceName||'Тень'
      setShadowVoiceName(vname)
      setShadowTyping(false)
      const isFinal=reply.includes('##FINAL##')
      const cleanReply=reply.replace('##FINAL##','').trim()
      setShadowMessages(prev=>[...prev,{role:'assistant',content:cleanReply,voiceName:vname}])
      const newHistory=isOpening
        ?[{role:'user',content:shadowQ?`Трансформируй этот вопрос в свой голос и задай первый неудобный вопрос: "${shadowQ}"`:'Задай первый вопрос.'},{role:'assistant',content:cleanReply}]
        :[...history,{role:'assistant',content:cleanReply}]
      setShadowHistory(newHistory)
      setShadowIteration(prev=>prev+1)
      if(isFinal||iteration>=SHADOW_MAX-1){setShadowDone(true)}
    }catch(e){setShadowTyping(false);showToast('Ошибка соединения с Тенью')}
  }

  async function sendToShadow(){
    const text=shadowInput.trim()
    if(!text||shadowDone||shadowTyping)return
    setShadowInput('')
    setShadowMessages(prev=>[...prev,{role:'user',content:text}])
    const newHistory=[...shadowHistory,{role:'user',content:text}]
    setShadowHistory(newHistory)
    await callShadow(newHistory,shadowIteration,shadowDominantIdx,false)
  }

  async function generateImprint(){
    showToast('Тень формирует твой слепок...')
    try{
      const res=await fetch('/api/imprint',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({history:shadowHistory,voiceName:shadowVoiceName,lang})})
      const data=await res.json()
      const raw=data.result||''
      const ex=(tag,next)=>{const m=raw.match(new RegExp(`##${tag}##\\s*([\\s\\S]*?)(?=##${next}##|$)`,'i'));return m?m[1].trim():''}
      setImprint({archetype:shadowVoiceName,resource:ex('RESOURCE','BLOCK'),block:ex('BLOCK','GROWTH'),growth:ex('GROWTH','XXXXEND')})
      setScreen('imprint')
    }catch(e){showToast('Не удалось сформировать слепок')}
  }

  function copyToClipboard(text){
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>showToast('✦  Скопировано в буфер обмена'))}
    else{const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;opacity:0';document.body.appendChild(ta);ta.focus();ta.select();try{document.execCommand('copy');showToast('✦  Скопировано')}catch(e){}document.body.removeChild(ta)}
  }

  function shareText(text,title){
    if(navigator.share){navigator.share({title,text}).catch(()=>copyToClipboard(text))}
    else copyToClipboard(text)
  }

  function restart(){
    setScreen('welcome');setQuestion('');setSelectedCards([])
    setResult(null);setError('');setShadowMessages([])
    setShadowHistory([]);setShadowIteration(0);setImprint(null);setShadowDone(false)
  }

  const resultText=result?[`THE ORACLE — ${resultCards.map(c=>c.name).join(' · ')}`,'',result.grid,'',result.blind,'',result.action,'',`✦ ${result.shadow}`].join('\n'):''
  const imprintText=imprint?[`ЦИФРОВОЙ СЛЕПОК · ${imprint.archetype}`,'',imprint.resource,'',imprint.block,'',`✦ ${imprint.growth}`].join('\n'):''
  const dialogText=shadowHistory.length?[`АУДИЕНЦИЯ С ТЕНЬЮ · ${shadowVoiceName}`,'',...shadowHistory.map(h=>`${h.role==='assistant'?shadowVoiceName:'Я'}: ${h.content}`),'','theoracle.app'].join('\n'):''

  return(
    <div className="app-root">
      <div className="starfield">{stars.map(s=><div key={s.id} className="star" style={{top:`${s.top}%`,left:`${s.left}%`,width:s.size,height:s.size,'--d':`${s.dur}s`,'--dl':`${s.delay}s`,'--lo':s.minOp,'--hi':s.maxOp}}/>)}</div>
      <div className="vignette"/>
      <div className="lang-bar">{['RU','KZ','EN'].map(l=><button key={l} className={`lang-btn${lang===l?' active':''}`} onClick={()=>setLang(l)}>{l}</button>)}</div>
      <div className="app">

        {/* WELCOME */}
        {screen==='welcome'&&(
          <div className="screen active">
            <div className="sigil" style={{marginTop:52}}>{SIGIL(76)}</div>
            <div className="eyebrow">{t.eyebrow}</div>
            <div className="wordmark">THE<br/>ORACLE</div>
            <div className="tagline">{t.sub}</div>
            <div className="divider"><div className="divider-line"/><div className="divider-gem">◆</div><div className="divider-line"/></div>
            <span className="field-label">{t.labelQ}</span>
            <textarea className="question-area" value={question} onChange={e=>setQuestion(e.target.value)} placeholder={t.placeholder} rows={4}/>
            {error&&<div className="error-msg" style={{display:'block'}}>{error}</div>}
            <button className="btn-primary" onClick={startReading}><span>{t.btnStart}</span></button>
          </div>
        )}

        {/* CARDS */}
        {screen==='cards'&&(
          <div className="screen active">
            <div className="sigil" style={{marginTop:44}}>{SIGIL(44)}</div>
            <div className="divider" style={{margin:'16px 0 0'}}><div className="divider-line"/><div className="divider-gem">◆</div><div className="divider-line"/></div>
            <div className="screen-title">{t.cardsTitle}</div>
            <div className="screen-sub" dangerouslySetInnerHTML={{__html:t.cardsSub}}/>
            <div className="counter"><span>{selectedCards.length} / 3</span></div>
            <div className="preview-row">
              {[0,1,2].map(i=>{const c=selectedCards[i]!==undefined?ARCANA[selectedCards[i]]:null;return(
                <div key={i} className={`preview-slot${c?' filled':''}`}>
                  {c?<><span style={{width:28,height:28,display:'flex'}} dangerouslySetInnerHTML={{__html:c.svg}}/><span className="slot-pos">{t.positions[i]}</span></>:<span style={{fontSize:13,color:'var(--text-muted)'}}>{['I','II','III'][i]}</span>}
                </div>
              )})}
            </div>
            <div className="cards-grid">
              {shuffledDeck.map(card=>{const isSel=selectedCards.includes(card.n);const isDim=!isSel&&selectedCards.length===3;return(
                <div key={card.n} className={`card-tile${isSel?' selected':''}${isDim?' dimmed':''}`} onClick={()=>!isDim&&toggleCard(card.n)}>
                  <div className="card-inner">
                    <div className="card-back-face">
                      <div className="back-corner tl"/><div className="back-corner tr"/><div className="back-corner bl"/><div className="back-corner br"/>
                      <div className="back-sigil" dangerouslySetInnerHTML={{__html:BACK_SVG}}/>
                    </div>
                    <div className="card-front-face">
                      <div className="front-corner tl"/><div className="front-corner tr"/><div className="front-corner bl"/><div className="front-corner br"/>
                      <div className="front-roman">{card.rom}</div>
                      <div className="card-svg" dangerouslySetInnerHTML={{__html:card.svg}}/>
                      <div className="card-name-small">{card.name}</div>
                    </div>
                  </div>
                </div>
              )})}
            </div>
            <button className="btn-primary" style={{marginTop:24}} onClick={revealCards} disabled={selectedCards.length!==3}><span>{t.btnReveal}</span></button>
          </div>
        )}

        {/* LOADING */}
        {screen==='loading'&&(
          <div className="screen active" style={{minHeight:'100vh',justifyContent:'center',gap:28}}>
            <svg className="loading-sigil" width="96" height="96" viewBox="0 0 96 96" fill="none">
              <circle cx="48" cy="48" r="45" stroke="#c9a84c" strokeWidth="0.4" opacity="0.2"/>
              <circle cx="48" cy="48" r="32" stroke="#c9a84c" strokeWidth="0.4" opacity="0.35"/>
              <path d="M48 7 L50 43 L85 45 L50 47 L48 83 L46 47 L11 45 L46 43 Z" fill="#c9a84c" opacity="0.55"/>
              <circle cx="48" cy="45" r="4.5" fill="#c9a84c" opacity="0.85"/>
            </svg>
            <div className="loading-dots"><div className="loading-dot"/><div className="loading-dot"/><div className="loading-dot"/></div>
            <div className="loading-label">{loadingText}</div>
          </div>
        )}

        {/* RESULT */}
        {screen==='result'&&result&&(
          <div className="screen active">
            <div className="sigil" style={{marginTop:44}}>{SIGIL(44)}</div>
            <div className="divider" style={{margin:'14px 0'}}><div className="divider-line"/><div className="divider-gem">◆</div><div className="divider-line"/></div>
            <div className="result-strip">
              {resultCards.map((c,i)=>(
                <div key={i} className="result-card" style={{animationDelay:`${i*0.15+0.1}s`}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',width:48,height:48,margin:'0 auto 8px'}} dangerouslySetInnerHTML={{__html:c.svg}}/>
                  <span className="rc-name">{c.name}</span>
                  <span className="rc-pos">{c.position}</span>
                </div>
              ))}
            </div>
            <div style={{width:'100%'}}>
              {[{label:t.blockLabels.grid,text:result.grid,delay:300},{label:t.blockLabels.blind,text:result.blind,delay:1200},{label:t.blockLabels.action,text:result.action,delay:2400}].filter(s=>s.text).map((s,i)=>(
                <div key={i} className="reading-block" style={{animationDelay:`${0.3+i*0.2}s`}}>
                  <span className="block-tag">{s.label}</span>
                  <div className="block-body"><StreamText text={s.text} delay={s.delay} speed={18}/></div>
                </div>
              ))}
            </div>
            {result.shadow&&(
              <div className="shadow-block">
                <span className="shadow-label">{t.shadowLabel}</span>
                <div className="shadow-question"><StreamText text={result.shadow} delay={3800} speed={60}/></div>
              </div>
            )}
            <div className="share-row">
              <button className="btn-share-story" onClick={()=>shareText(resultText,'THE ORACLE · Мой расклад')}><span>✦</span><span>{t.btnStory}</span></button>
              <button className="btn-share-copy" onClick={()=>copyToClipboard(resultText)}><span>⎘</span><span>{t.btnCopy}</span></button>
            </div>
            <button className="btn-shadow-cta" onClick={startShadowAudience}>
              <span className="btn-shadow-icon">🌑</span>
              <div className="btn-shadow-content"><span className="btn-shadow-title">{t.btnShadowCta}</span><span className="btn-shadow-sub">{t.btnShadowSub}</span></div>
              <span className="btn-shadow-arrow">→</span>
            </button>
            <button className="btn-ghost" onClick={restart}><span>{t.btnRestart}</span></button>
          </div>
        )}

        {/* SHADOW */}
        {screen==='shadow'&&(
          <div className="screen active">
            <div className="shadow-session-header">
              {SIGIL(40)}
              <div><div className="shadow-session-title">Аудиенция с Тенью</div><div className="shadow-session-sub">{shadowVoiceName}</div></div>
              <div className="shadow-counter">{Math.min(shadowIteration,SHADOW_MAX)}/{SHADOW_MAX}</div>
            </div>
            <div className="shadow-progress"><div className="shadow-progress-bar" style={{width:`${Math.min((shadowIteration/SHADOW_MAX)*100,100)}%`}}/></div>
            <div className="shadow-chat" ref={chatRef}>
              {shadowMessages.map((msg,i)=>(
                <div key={i} className={`chat-msg ${msg.role==='assistant'?'shadow-msg':'user-msg'}`}>
                  {msg.role==='assistant'&&<span className="shadow-voice-label">{msg.voiceName||shadowVoiceName}</span>}
                  {msg.content}
                </div>
              ))}
              {shadowTyping&&<div className="shadow-typing"><span/><span/><span/></div>}
            </div>
            {!shadowDone&&(
              <div className="shadow-input-area">
                <textarea className="shadow-textarea" value={shadowInput} onChange={e=>setShadowInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendToShadow()}}} placeholder="Твой ответ Тени..." disabled={shadowTyping}/>
                <button className="shadow-send-btn" onClick={sendToShadow} disabled={shadowTyping||!shadowInput.trim()}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            )}
            {shadowDone&&(
              <div className="shadow-done-area">
                <div className="share-row">
                  <button className="btn-share-story" onClick={()=>shareText(dialogText,'Аудиенция с Тенью')}><span>✦</span><span>{t.btnShareDialog}</span></button>
                  <button className="btn-share-copy" onClick={()=>copyToClipboard(dialogText)}><span>⎘</span><span>{t.btnCopy}</span></button>
                </div>
                <button className="btn-shadow-cta" style={{marginTop:12,opacity:1,animation:'none'}} onClick={generateImprint}>
                  <span className="btn-shadow-icon">🌑</span>
                  <div className="btn-shadow-content"><span className="btn-shadow-title">{t.btnGetImprint}</span><span className="btn-shadow-sub">Твой архетипический портрет</span></div>
                  <span className="btn-shadow-arrow">→</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* IMPRINT */}
        {screen==='imprint'&&imprint&&(
          <div className="screen active">
            <div className="sigil" style={{marginTop:44}}>{SIGIL(44)}</div>
            <div className="divider" style={{margin:'14px 0'}}><div className="divider-line"/><div className="divider-gem">◆</div><div className="divider-line"/></div>
            <div className="imprint-label">{t.imprintLabel}</div>
            <div className="imprint-archetype">{imprint.archetype}</div>
            <div className="reading-block" style={{animationDelay:'0.3s',width:'100%'}}>
              <span className="block-tag">{t.imprintResource}</span>
              <div className="block-body">{imprint.resource}</div>
            </div>
            <div className="reading-block" style={{animationDelay:'0.5s',width:'100%'}}>
              <span className="block-tag">{t.imprintBlock}</span>
              <div className="block-body">{imprint.block}</div>
            </div>
            <div className="shadow-block" style={{animationDelay:'0.7s'}}>
              <span className="shadow-label">{t.imprintGrowth}</span>
              <div className="shadow-question">{imprint.growth}</div>
            </div>
            <div className="share-row" style={{animationDelay:'0.9s'}}>
              <button className="btn-share-story" onClick={()=>shareText(imprintText,'Мой Цифровой Слепок Тени')}><span>✦</span><span>{t.btnShareImprint}</span></button>
              <button className="btn-share-copy" onClick={()=>copyToClipboard(imprintText)}><span>⎘</span><span>{t.btnCopyImprint}</span></button>
            </div>
            <button className="btn-ghost" onClick={restart} style={{animationDelay:'1.1s'}}><span>{t.btnRestart}</span></button>
          </div>
        )}

      </div>
      <div className={`toast${toast?' show':''}`}>{toast}</div>
    </div>
  )
}
