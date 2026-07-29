import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Mic, MapPin, Send, CheckCircle2, AlertTriangle, Globe,
  Sparkles, History, Bot, Award, Shield, X, Search, ChevronRight,
  Languages, Volume2, Star, Zap, Clock, Phone
} from 'lucide-react';

// ─────────────────────────────────────────────
// ALL 22 OFFICIAL INDIAN LANGUAGES + ENGLISH
// Scheduled 8th of the Indian Constitution
// ─────────────────────────────────────────────
export const INDIAN_LANGUAGES = [
  { code: 'EN',  name: 'English',    native: 'English',         script: 'Latin',      rtl: false, region: 'National' },
  { code: 'HI',  name: 'Hindi',      native: 'हिन्दी',           script: 'Devanagari', rtl: false, region: 'North India' },
  { code: 'BN',  name: 'Bengali',    native: 'বাংলা',            script: 'Bengali',    rtl: false, region: 'West Bengal, Tripura' },
  { code: 'TE',  name: 'Telugu',     native: 'తెలుగు',           script: 'Telugu',     rtl: false, region: 'Andhra Pradesh, Telangana' },
  { code: 'MR',  name: 'Marathi',    native: 'मराठी',            script: 'Devanagari', rtl: false, region: 'Maharashtra' },
  { code: 'TA',  name: 'Tamil',      native: 'தமிழ்',            script: 'Tamil',      rtl: false, region: 'Tamil Nadu, Puducherry' },
  { code: 'UR',  name: 'Urdu',       native: 'اردو',             script: 'Nastaliq',   rtl: true,  region: 'Jammu & Kashmir, UP' },
  { code: 'GU',  name: 'Gujarati',   native: 'ગુજરાતી',          script: 'Gujarati',   rtl: false, region: 'Gujarat' },
  { code: 'KN',  name: 'Kannada',    native: 'ಕನ್ನಡ',            script: 'Kannada',    rtl: false, region: 'Karnataka' },
  { code: 'ML',  name: 'Malayalam',  native: 'മലയാളം',           script: 'Malayalam',  rtl: false, region: 'Kerala, Lakshadweep' },
  { code: 'OR',  name: 'Odia',       native: 'ଓଡ଼ିଆ',            script: 'Odia',       rtl: false, region: 'Odisha' },
  { code: 'PA',  name: 'Punjabi',    native: 'ਪੰਜਾਬੀ',           script: 'Gurmukhi',   rtl: false, region: 'Punjab, Haryana' },
  { code: 'AS',  name: 'Assamese',   native: 'অসমীয়া',          script: 'Bengali',    rtl: false, region: 'Assam' },
  { code: 'MAI', name: 'Maithili',   native: 'मैथिली',           script: 'Devanagari', rtl: false, region: 'Bihar, Jharkhand' },
  { code: 'SAT', name: 'Santali',    native: 'ᱥᱟᱱᱛᱟᱲᱤ',          script: 'Ol Chiki',   rtl: false, region: 'Jharkhand, WB, Odisha' },
  { code: 'KS',  name: 'Kashmiri',   native: 'کٲشُر',             script: 'Nastaliq',   rtl: true,  region: 'Jammu & Kashmir' },
  { code: 'NE',  name: 'Nepali',     native: 'नेपाली',           script: 'Devanagari', rtl: false, region: 'Sikkim, West Bengal' },
  { code: 'SD',  name: 'Sindhi',     native: 'سنڌي',             script: 'Perso-Arab', rtl: true,  region: 'Gujarat, Maharashtra' },
  { code: 'KOK', name: 'Konkani',    native: 'कोंकणी',           script: 'Devanagari', rtl: false, region: 'Goa, Karnataka, Kerala' },
  { code: 'DOI', name: 'Dogri',      native: 'डोगरी',            script: 'Devanagari', rtl: false, region: 'Jammu' },
  { code: 'MNI', name: 'Manipuri',   native: 'মৈতৈলোন্',          script: 'Meitei',     rtl: false, region: 'Manipur' },
  { code: 'BRX', name: 'Bodo',       native: 'बड़ो',              script: 'Devanagari', rtl: false, region: 'Assam' },
  { code: 'SA',  name: 'Sanskrit',   native: 'संस्कृतम्',        script: 'Devanagari', rtl: false, region: 'Classical / National' },
];

// ─────────────────────────────────────────────
// FULL TRANSLATION DICTIONARY
// keys: title, subtitle, report, track, chat, rewards,
//       selectPhoto, aiRunning, verified, category, dept,
//       notes, voiceBtn, listening, submit, submitBtn,
//       trackTitle, chatPlaceholder, chatGreet, langTitle,
//       searchLang, points, badge, recent, resolve, emergency,
//       duplicate, gpsLabel, gpsAccurate, noPhoto
// ─────────────────────────────────────────────
const T = {
  EN: {
    title: 'CivicEye', subtitle: 'AI-Powered Civic Reporting',
    report: 'Report', track: 'Track', chat: 'AI Help', rewards: 'Points',
    selectPhoto: 'Select Issue Photo:', aiRunning: 'Running AI Vision Analysis...',
    verified: '✓ Genuine Civic Issue Verified', category: 'Category', dept: 'Routed Dept',
    notes: 'Complaint Notes', voiceBtn: '🎙 Voice Input', listening: '⏺ Listening...',
    submit: 'Submit to Municipality', noPhoto: 'Please select a photo above first.',
    trackTitle: 'Live Complaint Tracking', chatGreet: 'Hi! I am CivicEye AI. Ask me anything.',
    chatPlaceholder: 'Ask AI Assistant...', points: 'Civic Points', badge: 'Civic Champion',
    recent: 'Recent Activity', resolve: 'Avg. Resolution', emergency: '🚨 Emergency',
    duplicate: 'Similar complaint found nearby! You can track or upvote it instead.',
    gpsLabel: 'Auto GPS Location', gpsAccurate: '100% Accurate',
    langTitle: 'Select Your Language', searchLang: 'Search languages...',
    step1: 'Complaint Submitted', step2: 'Officer Accepted', step3: 'Worker Dispatched',
    step4: 'Work Completed & Rated', voiceText: 'Deep hazardous pothole near main junction.',
  },
  HI: {
    title: 'सिविकआई', subtitle: 'एआई संचालित नागरिक रिपोर्टिंग',
    report: 'रिपोर्ट', track: 'ट्रैक', chat: 'सहायता', rewards: 'पॉइंट',
    selectPhoto: 'समस्या की फोटो चुनें:', aiRunning: 'एआई विश्लेषण चल रहा है...',
    verified: '✓ वास्तविक नागरिक समस्या सत्यापित', category: 'श्रेणी', dept: 'विभाग',
    notes: 'शिकायत नोट्स', voiceBtn: '🎙 आवाज़ इनपुट', listening: '⏺ सुन रहा हूँ...',
    submit: 'नगर पालिका को सबमिट करें', noPhoto: 'कृपया पहले फोटो चुनें।',
    trackTitle: 'लाइव शिकायत ट्रैकिंग', chatGreet: 'नमस्ते! मैं सिविकआई एआई हूँ।',
    chatPlaceholder: 'एआई से पूछें...', points: 'नागरिक पॉइंट', badge: 'नागरिक चैंपियन',
    recent: 'हालिया गतिविधि', resolve: 'औसत समाधान', emergency: '🚨 आपातकाल',
    duplicate: 'पास में इसी तरह की शिकायत मिली! आप उसे ट्रैक या अपवोट कर सकते हैं।',
    gpsLabel: 'स्वचालित GPS स्थान', gpsAccurate: '100% सटीक',
    langTitle: 'अपनी भाषा चुनें', searchLang: 'भाषा खोजें...',
    step1: 'शिकायत दर्ज', step2: 'अधिकारी स्वीकृत', step3: 'कर्मचारी भेजे गए',
    step4: 'कार्य पूर्ण एवं मूल्यांकन', voiceText: 'मुख्य चौराहे के पास खतरनाक गड्ढा है।',
  },
  BN: {
    title: 'সিভিকআই', subtitle: 'এআই চালিত নাগরিক রিপোর্টিং',
    report: 'রিপোর্ট', track: 'ট্র্যাক', chat: 'সাহায্য', rewards: 'পয়েন্ট',
    selectPhoto: 'সমস্যার ছবি বেছে নিন:', aiRunning: 'এআই বিশ্লেষণ চলছে...',
    verified: '✓ প্রকৃত নাগরিক সমস্যা যাচাই', category: 'বিভাগ', dept: 'রুটেড বিভাগ',
    notes: 'অভিযোগ নোট', voiceBtn: '🎙 কণ্ঠ ইনপুট', listening: '⏺ শুনছি...',
    submit: 'পৌরসভায় জমা দিন', noPhoto: 'অনুগ্রহ করে প্রথমে ছবি নির্বাচন করুন।',
    trackTitle: 'লাইভ অভিযোগ ট্র্যাকিং', chatGreet: 'হ্যালো! আমি সিভিকআই এআই।',
    chatPlaceholder: 'এআই কে জিজ্ঞেস করুন...', points: 'নাগরিক পয়েন্ট', badge: 'নাগরিক চ্যাম্পিয়ন',
    recent: 'সাম্প্রতিক কার্যক্রম', resolve: 'গড় সমাধান', emergency: '🚨 জরুরি',
    duplicate: 'কাছাকাছি একই অভিযোগ পাওয়া গেছে!',
    gpsLabel: 'স্বয়ংক্রিয় GPS অবস্থান', gpsAccurate: '১০০% সঠিক',
    langTitle: 'আপনার ভাষা বেছে নিন', searchLang: 'ভাষা খুঁজুন...',
    step1: 'অভিযোগ দাখিল', step2: 'অফিসার গৃহীত', step3: 'কর্মী প্রেরিত',
    step4: 'কাজ সম্পন্ন ও মূল্যায়ন', voiceText: 'প্রধান রাস্তার পাশে বড় গর্ত রয়েছে।',
  },
  TE: {
    title: 'సివిక్‌ఐ', subtitle: 'AI పవర్డ్ పౌర రిపోర్టింగ్',
    report: 'రిపోర్ట్', track: 'ట్రాక్', chat: 'సహాయం', rewards: 'పాయింట్లు',
    selectPhoto: 'సమస్య ఫోటో ఎంచుకోండి:', aiRunning: 'AI విశ్లేషణ నడుస్తోంది...',
    verified: '✓ నిజమైన పౌర సమస్య ధృవీకరించబడింది', category: 'వర్గం', dept: 'విభాగం',
    notes: 'ఫిర్యాదు గమనికలు', voiceBtn: '🎙 వాయిస్ ఇన్‌పుట్', listening: '⏺ వింటున్నాను...',
    submit: 'మున్సిపాలిటీకి సమర్పించండి', noPhoto: 'దయచేసి ముందు ఫోటో ఎంచుకోండి.',
    trackTitle: 'లైవ్ ఫిర్యాదు ట్రాకింగ్', chatGreet: 'నమస్కారం! నేను సివిక్‌ఐ AI.',
    chatPlaceholder: 'AI ని అడగండి...', points: 'పౌర పాయింట్లు', badge: 'పౌర ఛాంపియన్',
    recent: 'ఇటీవలి కార్యకలాపం', resolve: 'సగటు పరిష్కారం', emergency: '🚨 అత్యవసర',
    duplicate: 'సమీపంలో అదే ఫిర్యాదు కనుగొనబడింది!',
    gpsLabel: 'ఆటో GPS స్థానం', gpsAccurate: '100% ఖచ్చితమైన',
    langTitle: 'మీ భాష ఎంచుకోండి', searchLang: 'భాషలు వెతకండి...',
    step1: 'ఫిర్యాదు సమర్పించబడింది', step2: 'అధికారి అంగీకరించారు', step3: 'కార్మికులు పంపారు',
    step4: 'పని పూర్తి & రేటింగ్', voiceText: 'ప్రధాన జంక్షన్ వద్ద రహదారిపై పెద్ద గుంత ఉంది.',
  },
  MR: {
    title: 'सिविकआय', subtitle: 'एआय संचलित नागरिक तक्रार',
    report: 'रिपोर्ट', track: 'ट्रॅक', chat: 'मदत', rewards: 'पॉइंट',
    selectPhoto: 'समस्येचा फोटो निवडा:', aiRunning: 'एआय विश्लेषण चालू...',
    verified: '✓ खरी नागरिक समस्या सत्यापित', category: 'श्रेणी', dept: 'विभाग',
    notes: 'तक्रार नोट्स', voiceBtn: '🎙 आवाज इनपुट', listening: '⏺ ऐकत आहे...',
    submit: 'महापालिकेला सबमिट करा', noPhoto: 'कृपया प्रथम फोटो निवडा.',
    trackTitle: 'थेट तक्रार ट्रॅकिंग', chatGreet: 'नमस्कार! मी सिविकआय एआय आहे.',
    chatPlaceholder: 'एआयला विचारा...', points: 'नागरिक पॉइंट', badge: 'नागरिक चॅम्पियन',
    recent: 'अलीकडील क्रियाकलाप', resolve: 'सरासरी निराकरण', emergency: '🚨 आपत्कालीन',
    duplicate: 'जवळ अशीच तक्रार आढळली!',
    gpsLabel: 'ऑटो GPS स्थान', gpsAccurate: '100% अचूक',
    langTitle: 'तुमची भाषा निवडा', searchLang: 'भाषा शोधा...',
    step1: 'तक्रार सादर', step2: 'अधिकाऱ्याने स्वीकारले', step3: 'कामगार पाठवले',
    step4: 'काम पूर्ण व रेटिंग', voiceText: 'मुख्य रस्त्यावर मोठा खड्डा आहे.',
  },
  TA: {
    title: 'சிவிக்ஐ', subtitle: 'AI தானியங்கி புகாரளிப்பு',
    report: 'புகார்', track: 'கண்காணி', chat: 'உதவி', rewards: 'புள்ளிகள்',
    selectPhoto: 'பிரச்சினை புகைப்படம் தேர்ந்தெடுக்கவும்:', aiRunning: 'AI பகுப்பாய்வு இயங்குகிறது...',
    verified: '✓ உண்மையான குடிமை சிக்கல் சரிபார்க்கப்பட்டது', category: 'வகை', dept: 'திணைக்களம்',
    notes: 'புகார் குறிப்புகள்', voiceBtn: '🎙 குரல் உள்ளீடு', listening: '⏺ கேட்கிறேன்...',
    submit: 'நகராட்சிக்கு சமர்ப்பிக்கவும்', noPhoto: 'முதலில் புகைப்படம் தேர்வு செய்யவும்.',
    trackTitle: 'நேரடி புகார் கண்காணிப்பு', chatGreet: 'வணக்கம்! நான் சிவிக்ஐ AI.',
    chatPlaceholder: 'AI ஐ கேளுங்கள்...', points: 'குடிமை புள்ளிகள்', badge: 'குடிமை சாம்பியன்',
    recent: 'சமீபத்திய செயல்பாடு', resolve: 'சராசரி தீர்வு', emergency: '🚨 அவசரம்',
    duplicate: 'அருகில் இதே போன்ற புகார் கண்டுபிடிக்கப்பட்டது!',
    gpsLabel: 'தானியங்கி GPS இடம்', gpsAccurate: '100% துல்லியம்',
    langTitle: 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்', searchLang: 'மொழிகளை தேடுக...',
    step1: 'புகார் சமர்ப்பிக்கப்பட்டது', step2: 'அதிகாரி ஏற்றார்', step3: 'தொழிலாளர் அனுப்பப்பட்டனர்',
    step4: 'பணி முடிந்தது & மதிப்பீடு', voiceText: 'ரோட்டில் பெரிய பள்ளம் உள்ளது, உடனே சரி செய்யவும்.',
  },
  UR: {
    title: 'سِوِک آئی', subtitle: 'اے آئی سے چلنے والی شہری رپورٹنگ',
    report: 'رپورٹ', track: 'ٹریک', chat: 'مدد', rewards: 'پوائنٹس',
    selectPhoto: 'مسئلے کی تصویر منتخب کریں:', aiRunning: 'اے آئی تجزیہ جاری ہے...',
    verified: '✓ حقیقی شہری مسئلہ تصدیق شدہ', category: 'زمرہ', dept: 'محکمہ',
    notes: 'شکایت نوٹ', voiceBtn: '🎙 آواز ان پٹ', listening: '⏺ سن رہا ہوں...',
    submit: 'بلدیہ کو جمع کریں', noPhoto: 'براہ کرم پہلے تصویر منتخب کریں۔',
    trackTitle: 'براہ راست شکایت ٹریکنگ', chatGreet: 'سلام! میں سوک آئی اے آئی ہوں۔',
    chatPlaceholder: 'اے آئی سے پوچھیں...', points: 'شہری پوائنٹس', badge: 'شہری چیمپیئن',
    recent: 'حالیہ سرگرمی', resolve: 'اوسط حل', emergency: '🚨 ہنگامی',
    duplicate: 'قریب میں اسی طرح کی شکایت ملی!',
    gpsLabel: 'خودکار GPS مقام', gpsAccurate: '100% درست',
    langTitle: 'اپنی زبان منتخب کریں', searchLang: 'زبانیں تلاش کریں...',
    step1: 'شکایت جمع', step2: 'افسر نے قبول کیا', step3: 'کارکن بھیجا گیا',
    step4: 'کام مکمل اور ریٹنگ', voiceText: 'مین روڈ پر گہرا کھڈا موجود ہے۔',
  },
  GU: {
    title: 'સિવિકઆઈ', subtitle: 'AI આધારિત નાગરિક ફરિયાદ',
    report: 'ફરિયાદ', track: 'ટ્રૅક', chat: 'મદદ', rewards: 'પૉઇન્ટ',
    selectPhoto: 'સમસ્યાનો ફોટો પસંદ કરો:', aiRunning: 'AI વિશ્લેષણ ચાલુ...',
    verified: '✓ સાચી નાગરિક સમસ્યા ચકાસી', category: 'વર્ગ', dept: 'વિભાગ',
    notes: 'ફરિયાદ નોંધ', voiceBtn: '🎙 અવાજ ઇનપુટ', listening: '⏺ સાંભળું છું...',
    submit: 'નગરપાલિકામાં સબમિટ કરો', noPhoto: 'કૃપા કરી પહેલા ફોટો પસંદ કરો.',
    trackTitle: 'સીધી ફરિયાદ ટ્રૅકિંગ', chatGreet: 'નમસ્તે! હું સિવિકઆઈ AI છું.',
    chatPlaceholder: 'AI ને પૂછો...', points: 'નાગરિક પૉઇન્ટ', badge: 'નાગરિક ચૅમ્પિયન',
    recent: 'તાજેતરની પ્રવૃત્તિ', resolve: 'સરેરાશ ઉકેલ', emergency: '🚨 કટોકટી',
    duplicate: 'નજીકમાં આ જ ફરિયાદ મળી!',
    gpsLabel: 'ઓટો GPS સ્થાન', gpsAccurate: '100% ચોક્કસ',
    langTitle: 'તમારી ભાષા પસંદ કરો', searchLang: 'ભાષા શોધો...',
    step1: 'ફરિયાદ સબમિટ', step2: 'અધિકારીએ સ્વીકાર્યું', step3: 'કામદાર મોકલ્યા',
    step4: 'કામ પૂર્ણ & રેટિંગ', voiceText: 'મુખ્ય રસ્તા પર મોટો ખાડો છે.',
  },
  KN: {
    title: 'ಸಿವಿಕ್‌ಐ', subtitle: 'AI ಚಾಲಿತ ನಾಗರಿಕ ದೂರು',
    report: 'ವರದಿ', track: 'ಟ್ರ್ಯಾಕ್', chat: 'ಸಹಾಯ', rewards: 'ಅಂಕಗಳು',
    selectPhoto: 'ಸಮಸ್ಯೆ ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡಿ:', aiRunning: 'AI ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...',
    verified: '✓ ನಿಜವಾದ ನಾಗರಿಕ ಸಮಸ್ಯೆ ದೃಢೀಕೃತ', category: 'ವರ್ಗ', dept: 'ಇಲಾಖೆ',
    notes: 'ದೂರು ಟಿಪ್ಪಣಿಗಳು', voiceBtn: '🎙 ಧ್ವನಿ ಇನ್‌ಪುಟ್', listening: '⏺ ಕೇಳುತ್ತಿದ್ದೇನೆ...',
    submit: 'ಮಹಾನಗರಪಾಲಿಕೆಗೆ ಸಲ್ಲಿಸಿ', noPhoto: 'ಮೊದಲು ಫೋಟೋ ಆಯ್ಕೆ ಮಾಡಿ.',
    trackTitle: 'ನೇರ ದೂರು ಟ್ರ್ಯಾಕಿಂಗ್', chatGreet: 'ನಮಸ್ಕಾರ! ನಾನು ಸಿವಿಕ್‌ಐ AI.',
    chatPlaceholder: 'AI ಗೆ ಕೇಳಿ...', points: 'ನಾಗರಿಕ ಅಂಕಗಳು', badge: 'ನಾಗರಿಕ ಚಾಂಪಿಯನ್',
    recent: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ', resolve: 'ಸರಾಸರಿ ಪರಿಹಾರ', emergency: '🚨 ತುರ್ತು',
    duplicate: 'ಹತ್ತಿರದಲ್ಲಿ ಇದೇ ದೂರು ಕಂಡುಬಂತು!',
    gpsLabel: 'ಸ್ವಯಂ GPS ಸ್ಥಳ', gpsAccurate: '100% ನಿಖರ',
    langTitle: 'ನಿಮ್ಮ ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ', searchLang: 'ಭಾಷೆ ಹುಡುಕಿ...',
    step1: 'ದೂರು ಸಲ್ಲಿಸಲಾಯಿತು', step2: 'ಅಧಿಕಾರಿ ಒಪ್ಪಿದರು', step3: 'ಕಾರ್ಮಿಕರು ಕಳಿಸಲಾಯಿತು',
    step4: 'ಕೆಲಸ ಪೂರ್ಣ & ರೇಟಿಂಗ್', voiceText: 'ಮುಖ್ಯ ರಸ್ತೆಯಲ್ಲಿ ದೊಡ್ಡ ಗುಂಡಿ ಬಿದ್ದಿದೆ.',
  },
  ML: {
    title: 'സിവിക്‌ഐ', subtitle: 'AI അധിഷ്ഠിത ജനകീയ പരാതി',
    report: 'പരാതി', track: 'ട്രാക്ക്', chat: 'സഹായം', rewards: 'പോയിന്റ്',
    selectPhoto: 'പ്രശ്‌നത്തിന്റെ ഫോട്ടോ തിരഞ്ഞെടുക്കൂ:', aiRunning: 'AI വിശകലനം ചെയ്യുന്നു...',
    verified: '✓ യഥാർഥ പൗര പ്രശ്‌നം സ്ഥിരീകരിച്ചു', category: 'വർഗ്ഗം', dept: 'വകുപ്പ്',
    notes: 'പരാതി കുറിപ്പുകൾ', voiceBtn: '🎙 ശബ്ദ ഇൻപുട്ട്', listening: '⏺ കേൾക്കുന്നു...',
    submit: 'മുനിസിപ്പാലിറ്റിക്ക് സമർപ്പിക്കൂ', noPhoto: 'ദയവായി ആദ്യം ഫോട്ടോ തിരഞ്ഞെടുക്കൂ.',
    trackTitle: 'തൽസമയ പരാതി ട്രാക്കിംഗ്', chatGreet: 'ഹലോ! ഞാൻ CivicEye AI ആണ്.',
    chatPlaceholder: 'AI നോട് ചോദിക്കൂ...', points: 'പൗര പോയിന്റ്', badge: 'പൗര ചാമ്പ്യൻ',
    recent: 'സമീപകാല പ്രവർത്തനം', resolve: 'ശരാശരി പരിഹാരം', emergency: '🚨 അടിയന്തര',
    duplicate: 'സമീപത്ത് ഇതേ പരാതി കണ്ടെത്തി!',
    gpsLabel: 'ഓട്ടോ GPS ലൊക്കേഷൻ', gpsAccurate: '100% കൃത്യം',
    langTitle: 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കൂ', searchLang: 'ഭാഷകൾ തിരയൂ...',
    step1: 'പരാതി സമർപ്പിച്ചു', step2: 'ഓഫീസർ സ്വീകരിച്ചു', step3: 'തൊഴിലാളിയെ അയച്ചു',
    step4: 'ജോലി പൂർത്തിയായി & റേറ്റിംഗ്', voiceText: 'പ്രധാന റോഡിൽ വലിയ കുഴിയുണ്ട്.',
  },
  OR: {
    title: 'ସିଭିକ୍‌ଆଇ', subtitle: 'AI ଚାଳିତ ନାଗରିକ ଅଭିଯୋଗ',
    report: 'ରିପୋର୍ଟ', track: 'ଟ୍ରାକ', chat: 'ସାହାଯ୍ୟ', rewards: 'ପଏଣ୍ଟ',
    selectPhoto: 'ସମସ୍ୟାର ଫଟୋ ଚୟନ କରନ୍ତୁ:', aiRunning: 'AI ବିଶ୍ଳେଷଣ ଚଲୁ...',
    verified: '✓ ଯଥାର୍ଥ ନାଗରିକ ସମସ୍ୟା ସ୍ଥିର', category: 'ବର୍ଗ', dept: 'ବିଭାଗ',
    notes: 'ଅଭିଯୋଗ ନୋଟ', voiceBtn: '🎙 ଭଏସ ଇନ୍ପୁଟ', listening: '⏺ ଶୁଣୁଛି...',
    submit: 'ନଗରପାଳିକାରେ ଦାଖଲ', noPhoto: 'ଦୟାକରି ପ୍ରଥମେ ଫଟୋ ଚୟନ କରନ୍ତୁ।',
    trackTitle: 'ଲାଇଭ ଅଭିଯୋଗ ଟ୍ରାକ', chatGreet: 'ନମସ୍କାର! ମୁଁ ସିଭିକ୍‌ଆଇ AI।',
    chatPlaceholder: 'AI କୁ ପଚାରନ୍ତୁ...', points: 'ନାଗରିକ ପଏଣ୍ଟ', badge: 'ନାଗରିକ ଚ୍ୟାମ୍ପିଅନ',
    recent: 'ସଦ୍ୟ କାର୍ଯ୍ୟ', resolve: 'ଗଡ଼ ସମାଧାନ', emergency: '🚨 ଜରୁରୀ',
    duplicate: 'ନିକଟରେ ଏହି ଅଭିଯୋଗ ମିଳିଛି!',
    gpsLabel: 'ସ୍ୱୟଂ GPS ସ୍ଥାନ', gpsAccurate: '100% ସଠିକ',
    langTitle: 'ଆପଣଙ୍କ ଭାଷା ବାଛନ୍ତୁ', searchLang: 'ଭାଷା ଖୋଜ...',
    step1: 'ଅଭିଯୋଗ ଦାଖଲ', step2: 'ଅଧିକାରୀ ଗ୍ରହଣ', step3: 'ଶ୍ରମିକ ପଠାଇଲି',
    step4: 'କାର୍ଯ ସଂପୂର୍ଣ ଓ ମୂଲ୍ୟାୟନ', voiceText: 'ମୁଖ୍ୟ ରାସ୍ତାରେ ବଡ଼ ଗାତ ଅଛି।',
  },
  PA: {
    title: 'ਸਿਵਿਕਆਈ', subtitle: 'AI ਸੰਚਾਲਿਤ ਨਾਗਰਿਕ ਸ਼ਿਕਾਇਤ',
    report: 'ਰਿਪੋਰਟ', track: 'ਟ੍ਰੈਕ', chat: 'ਮਦਦ', rewards: 'ਪੁਆਇੰਟ',
    selectPhoto: 'ਸਮੱਸਿਆ ਦੀ ਫੋਟੋ ਚੁਣੋ:', aiRunning: 'AI ਵਿਸ਼ਲੇਸ਼ਣ ਚੱਲ ਰਿਹਾ ਹੈ...',
    verified: '✓ ਅਸਲੀ ਨਾਗਰਿਕ ਸਮੱਸਿਆ ਸਤਿਆਪਿਤ', category: 'ਸ਼੍ਰੇਣੀ', dept: 'ਵਿਭਾਗ',
    notes: 'ਸ਼ਿਕਾਇਤ ਨੋਟਸ', voiceBtn: '🎙 ਆਵਾਜ਼ ਇਨਪੁੱਟ', listening: '⏺ ਸੁਣ ਰਿਹਾਂ...',
    submit: 'ਨਗਰਪਾਲਿਕਾ ਨੂੰ ਸਬਮਿਟ ਕਰੋ', noPhoto: 'ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਫੋਟੋ ਚੁਣੋ।',
    trackTitle: 'ਸਿੱਧੀ ਸ਼ਿਕਾਇਤ ਟ੍ਰੈਕਿੰਗ', chatGreet: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ CivicEye AI ਹਾਂ।',
    chatPlaceholder: 'AI ਤੋਂ ਪੁੱਛੋ...', points: 'ਨਾਗਰਿਕ ਪੁਆਇੰਟ', badge: 'ਨਾਗਰਿਕ ਚੈਂਪੀਅਨ',
    recent: 'ਹਾਲੀਆ ਗਤੀਵਿਧੀ', resolve: 'ਔਸਤ ਹੱਲ', emergency: '🚨 ਐਮਰਜੈਂਸੀ',
    duplicate: 'ਨੇੜੇ ਇਹੀ ਸ਼ਿਕਾਇਤ ਮਿਲੀ!',
    gpsLabel: 'ਆਟੋ GPS ਸਥਾਨ', gpsAccurate: '100% ਸਹੀ',
    langTitle: 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ', searchLang: 'ਭਾਸ਼ਾ ਖੋਜੋ...',
    step1: 'ਸ਼ਿਕਾਇਤ ਦਰਜ', step2: 'ਅਫਸਰ ਨੇ ਸਵੀਕਾਰ ਕੀਤਾ', step3: 'ਕਾਮੇ ਭੇਜੇ',
    step4: 'ਕੰਮ ਮੁਕੰਮਲ ਅਤੇ ਰੇਟਿੰਗ', voiceText: 'ਮੁੱਖ ਰੋਡ ਤੇ ਵੱਡਾ ਟੋਆ ਹੈ।',
  },
  AS: {
    title: 'ছিভিকআই', subtitle: 'AI চালিত নাগৰিক অভিযোগ',
    report: 'ৰিপ\'ৰ্ট', track: 'ট্ৰেক', chat: 'সহায়', rewards: 'পইন্ট',
    selectPhoto: 'সমস্যাৰ ফটো বাছক:', aiRunning: 'AI বিশ্লেষণ চলিছে...',
    verified: '✓ প্ৰকৃত নাগৰিক সমস্যা নিশ্চিত', category: 'শ্ৰেণী', dept: 'বিভাগ',
    notes: 'অভিযোগৰ টোকা', voiceBtn: '🎙 মাতৰ ইনপুট', listening: '⏺ শুনিছো...',
    submit: 'পুৰসভাত দাখিল কৰক', noPhoto: 'অনুগ্ৰহ কৰি প্ৰথমে ফটো বাছক।',
    trackTitle: 'লাইভ অভিযোগ ট্ৰেকিং', chatGreet: 'নমস্কাৰ! মই CivicEye AI।',
    chatPlaceholder: 'AI ক সোধক...', points: 'নাগৰিক পইন্ট', badge: 'নাগৰিক চেম্পিয়ন',
    recent: 'শেহতীয়া কাৰ্যকলাপ', resolve: 'গড় সমাধান', emergency: '🚨 জৰুৰী',
    duplicate: 'ওচৰতে একে অভিযোগ পোৱা গৈছে!',
    gpsLabel: 'স্বয়ংক্ৰিয় GPS স্থান', gpsAccurate: '100% সঠিক',
    langTitle: 'আপোনাৰ ভাষা বাছক', searchLang: 'ভাষা বিচাৰক...',
    step1: 'অভিযোগ দাখিল', step2: 'বিষয়াই গ্ৰহণ কৰিলে', step3: 'কামবন পঠাইছে',
    step4: 'কাম সম্পূৰ্ণ ও মূল্যায়ন', voiceText: 'মুখ্য পথত ডঙৰ গাত আছে।',
  },
  MAI: {
    title: 'सिविकआई', subtitle: 'एआई आधारित नागरिक रिपोर्टिंग',
    report: 'रिपोर्ट', track: 'ट्रैक', chat: 'सहायता', rewards: 'पॉइन्ट',
    selectPhoto: 'समस्याक फोटो चुनू:', aiRunning: 'एआई विश्लेषण चलि रहल अछि...',
    verified: '✓ वास्तविक नागरिक समस्या प्रमाणित', category: 'श्रेणी', dept: 'विभाग',
    notes: 'शिकायत नोट', voiceBtn: '🎙 आवाज इनपुट', listening: '⏺ सुनि रहल छी...',
    submit: 'नगरपालिका में दाखिल करू', noPhoto: 'कृपया पहिने फोटो चुनू।',
    trackTitle: 'लाइव शिकायत ट्रैकिंग', chatGreet: 'प्रणाम! हम CivicEye AI छी।',
    chatPlaceholder: 'एआई स पुछू...', points: 'नागरिक पॉइन्ट', badge: 'नागरिक चैंपियन',
    recent: 'हालिया गतिविधि', resolve: 'औसत समाधान', emergency: '🚨 आपातकाल',
    duplicate: 'नजदीक में इहो शिकायत भेटल!',
    gpsLabel: 'स्वचालित GPS स्थान', gpsAccurate: '100% सटीक',
    langTitle: 'अपन भाषा चुनू', searchLang: 'भाषा खोजू...',
    step1: 'शिकायत दर्ज', step2: 'अधिकारी स्वीकृत', step3: 'कर्मचारी भेजल',
    step4: 'काज पूर्ण और मूल्यांकन', voiceText: 'मुख्य चौराहे लग खतरनाक गड्ढा छै।',
  },
  SAT: {
    title: 'ᱥᱤᱵᱷᱤᱠᱟᱭ', subtitle: 'AI ᱫᱚ ᱱᱟᱜᱟᱨᱤᱠ ᱨᱤᱯᱚᱨᱴᱤᱝ',
    report: 'ᱨᱤᱯᱚᱨᱴ', track: 'ᱴᱨᱮᱠ', chat: 'ᱢᱮᱱ', rewards: 'ᱯᱚᱭᱮᱱᱴ',
    selectPhoto: 'ᱯᱷᱚᱴᱚ ᱮᱱᱮᱢ ᱢᱮ:', aiRunning: 'AI ᱩᱭᱢᱩᱜ ᱠᱟᱱᱟ...',
    verified: '✓ ᱥᱟᱱᱟᱢ ᱱᱟᱜᱟᱨᱤᱠ ᱥᱚᱢᱚᱥᱟ ᱵᱟᱲᱟᱭ', category: 'ᱵᱷᱮᱫ', dept: 'ᱵᱤᱵᱷᱟᱜ',
    notes: 'ᱢᱮᱱᱴᱮ ᱱᱚᱴ', voiceBtn: '🎙 ᱟᱣᱟᱡ ᱤᱱᱯᱩᱴ', listening: '⏺ ᱥᱩᱱᱩᱢ...',
    submit: 'ᱢᱩᱱᱤᱥᱤᱯᱟᱞᱤᱴᱤ ᱫᱟᱠᱷᱤᱞ', noPhoto: 'ᱛᱮᱦᱮᱧ ᱯᱷᱚᱴᱚ ᱮᱱᱮᱢ ᱢᱮ।',
    trackTitle: 'ᱞᱟᱭᱵᱷ ᱴᱨᱮᱠᱤᱝ', chatGreet: 'ᱡᱚᱦᱟᱨ! ᱟᱢ CivicEye AI।',
    chatPlaceholder: 'AI ᱠᱚ ᱢᱮᱱ ᱢᱮ...', points: 'ᱱᱟᱜᱟᱨᱤᱠ ᱯᱚᱭᱮᱱᱴ', badge: 'ᱱᱟᱜᱟᱨᱤᱠ ᱪᱮᱢᱯᱤᱭᱚᱱ',
    recent: 'ᱛᱟᱦᱮᱸ ᱠᱟᱢ', resolve: 'ᱟᱸᱫᱷᱟᱨ ᱱᱤᱵᱟᱨᱟᱜ', emergency: '🚨 ᱡᱚᱨᱩᱨᱤ',
    duplicate: 'ᱱᱮᱞᱮ ᱱᱮᱞᱮ ᱢᱮᱱ ᱵᱟᱰᱟᱭᱟ!',
    gpsLabel: 'ᱟᱴᱚ GPS ᱡᱟᱭᱜᱟ', gpsAccurate: '100% ᱥᱟᱦᱴᱤ',
    langTitle: 'ᱟᱯᱱᱟᱜ ᱵᱷᱟᱥᱟ ᱮᱱᱮᱢ ᱢᱮ', searchLang: 'ᱵᱷᱟᱥᱟ ᱦᱩᱰᱤᱧ...',
    step1: 'ᱢᱮᱱ ᱫᱟᱠᱷᱤᱞ', step2: 'ᱟᱯᱷᱤᱥᱟᱨ ᱢᱟᱱᱠᱟᱣ', step3: 'ᱠᱟᱢᱤ ᱯᱟᱬᱮᱭᱟ',
    step4: 'ᱠᱟᱢ ᱯᱩᱨᱟ ᱟᱨ ᱨᱮᱴᱤᱝ', voiceText: 'ᱢᱩᱠᱷᱤᱭᱟ ᱥᱚᱰᱚᱠ ᱞᱮ ᱵᱚᱰᱚ ᱜᱩᱫᱰᱤ ᱟᱫᱮᱭᱟ।',
  },
  KS: {
    title: 'سِوِک آئی', subtitle: 'اے آئی پاوَرڈ شہری رپورٹنگ',
    report: 'رپورٹ', track: 'ٹریک', chat: 'مدد', rewards: 'پواینٹ',
    selectPhoto: 'مسلہ کُنۍ فوٹو تھاوتھ کرِو:', aiRunning: 'اے آئی تجزیہ جاری...',
    verified: '✓ حقیقی شہری مسلہ مستند', category: 'زُمرَہ', dept: 'محکمہ',
    notes: 'شکایت نوٹ', voiceBtn: '🎙 آواز ان پٹ', listening: '⏺ سٲنچھِو...',
    submit: 'بلدیہ پیٹھ جمع کرِو', noPhoto: 'پہلہ فوٹو تھاوتھ کرِو۔',
    trackTitle: 'براہ راست ٹریکنگ', chatGreet: 'آداب! مٲ CivicEye AI چھُس۔',
    chatPlaceholder: 'اے آئی پیٹھ پُچھ...', points: 'شہری پواینٹ', badge: 'شہری چیمپیئن',
    recent: 'حالیہ سرگرمی', resolve: 'اوسط حل', emergency: '🚨 ہنگامی',
    duplicate: 'نزدیک اسے شکایت ملی!',
    gpsLabel: 'خودکار GPS مقام', gpsAccurate: '100% درست',
    langTitle: 'آپنہِ زبان تھاوتھ کرِو', searchLang: 'زبان تلاش کرِو...',
    step1: 'شکایت جمع', step2: 'افسر نے قبول', step3: 'کارکن روانہ',
    step4: 'کام مکمل اور ریٹنگ', voiceText: 'مین روڈ پیٹھ گہرو کھڈ چھُ۔',
  },
  NE: {
    title: 'सिभिकआई', subtitle: 'एआई शक्तिसम्पन्न नागरिक उजुरी',
    report: 'रिपोर्ट', track: 'ट्र्याक', chat: 'सहायता', rewards: 'पोइन्ट',
    selectPhoto: 'समस्याको फोटो छान्नुस्:', aiRunning: 'एआई विश्लेषण चलिरहेको...',
    verified: '✓ वास्तविक नागरिक समस्या प्रमाणित', category: 'श्रेणी', dept: 'विभाग',
    notes: 'उजुरी टिप्पणी', voiceBtn: '🎙 आवाज इनपुट', listening: '⏺ सुन्दैछु...',
    submit: 'नगरपालिकामा पेश गर्नुस्', noPhoto: 'कृपया पहिले फोटो छान्नुस्।',
    trackTitle: 'लाइभ उजुरी ट्र्याकिंग', chatGreet: 'नमस्ते! म CivicEye AI हुँ।',
    chatPlaceholder: 'एआईलाई सोध्नुस्...', points: 'नागरिक पोइन्ट', badge: 'नागरिक च्याम्पियन',
    recent: 'हालको गतिविधि', resolve: 'औसत समाधान', emergency: '🚨 आपतकाल',
    duplicate: 'नजिकमा उही उजुरी फेला पर्यो!',
    gpsLabel: 'स्वचालित GPS स्थान', gpsAccurate: '100% सटीक',
    langTitle: 'आफ्नो भाषा छान्नुस्', searchLang: 'भाषा खोज्नुस्...',
    step1: 'उजुरी दर्ता', step2: 'अधिकारीले स्वीकार', step3: 'कामदार पठाइयो',
    step4: 'काम सम्पन्न र मूल्याङ्कन', voiceText: 'मुख्य चोकमा खतरनाक खाडल छ।',
  },
  SD: {
    title: 'سِوِک آئی', subtitle: 'AI تي ٻڌل شهري شڪايت',
    report: 'رپورٽ', track: 'ٽريڪ', chat: 'مدد', rewards: 'پوائنٽ',
    selectPhoto: 'مسئلي جي فوٽو چونڊيو:', aiRunning: 'AI تجزيو هلي رهيو آهي...',
    verified: '✓ حقيقي شهري مسئلو تصديق ٿيل', category: 'زمرو', dept: 'کاتو',
    notes: 'شڪايت نوٽ', voiceBtn: '🎙 آواز ان پٽ', listening: '⏺ ٻڌي رهيو آهيان...',
    submit: 'ميونسپالٽي کي جمع ڪريو', noPhoto: 'مهرباني ڪري پهريان فوٽو چونڊيو.',
    trackTitle: 'سڌو شڪايت ٽريڪنگ', chatGreet: 'السلام! آءُ CivicEye AI آهيان.',
    chatPlaceholder: 'AI کان پڇو...', points: 'شهري پوائنٽ', badge: 'شهري چيمپيئن',
    recent: 'تازي سرگرمي', resolve: 'اوسط حل', emergency: '🚨 هنگامي',
    duplicate: 'ويجهو ساڳي شڪايت مليل!',
    gpsLabel: 'خودڪار GPS مڪان', gpsAccurate: '100% درست',
    langTitle: 'پنهنجي ٻولي چونڊيو', searchLang: 'ٻولي ڳوليو...',
    step1: 'شڪايت جمع', step2: 'آفيسر قبول ڪيو', step3: 'ڪاريگر موڪليو',
    step4: 'ڪم مڪمل ۽ ريٽنگ', voiceText: 'مين رستي تي وڏو کڏو آهي.',
  },
  KOK: {
    title: 'सिविकआय', subtitle: 'एआय आधारीत नागरिक तक्रार',
    report: 'रिपोर्ट', track: 'ट्रॅक', chat: 'मदत', rewards: 'पोइंट',
    selectPhoto: 'प्रश्नाचो फोटो निवडा:', aiRunning: 'एआय विश्लेषण चालू...',
    verified: '✓ खरी नागरिक समस्या प्रमाणित', category: 'प्रकार', dept: 'विभाग',
    notes: 'तक्रार नोट', voiceBtn: '🎙 आवाज इनपुट', listening: '⏺ आयकतां...',
    submit: 'महापालिकेक सबमिट करा', noPhoto: 'कृपया पयलें फोटो निवडा.',
    trackTitle: 'थेट तक्रार ट्रॅकिंग', chatGreet: 'देव बरें करो! हांव CivicEye AI.',
    chatPlaceholder: 'एआयक विचारा...', points: 'नागरिक पोइंट', badge: 'नागरिक चॅम्पियन',
    recent: 'अलीकडलें काम', resolve: 'सरासरी निराकरण', emergency: '🚨 आपत्कालीन',
    duplicate: 'जेगी तीच तक्रार मेळ्ळ्या!',
    gpsLabel: 'ऑटो GPS स्थान', gpsAccurate: '100% अचूक',
    langTitle: 'तुमची भाषा निवडा', searchLang: 'भाषा सोधा...',
    step1: 'तक्रार सादर', step2: 'अधिकार्यान स्वीकारलें', step3: 'कामगार धाडले',
    step4: 'काम पुरें & रेटिंग', voiceText: 'मुख्य रस्त्याचेर व्हडलो खड्डो आसा.',
  },
  DOI: {
    title: 'सिविकआई', subtitle: 'एआई आधारित नागरिक शिकायत',
    report: 'रिपोर्ट', track: 'ट्रैक', chat: 'मदद', rewards: 'पॉइंट',
    selectPhoto: 'समस्या दी फोटो चुनो:', aiRunning: 'एआई विश्लेषण चल्ला...',
    verified: '✓ असली नागरिक समस्या प्रमाणित', category: 'श्रेणी', dept: 'विभाग',
    notes: 'शिकायत नोट', voiceBtn: '🎙 आवाज इनपुट', listening: '⏺ सुनाई दे रिया...',
    submit: 'नगरपालिकेदे सबमिट करो', noPhoto: 'मेहरबानी करके पहले फोटो चुनो।',
    trackTitle: 'लाइव शिकायत ट्रैकिंग', chatGreet: 'नमस्कार! मैं CivicEye AI आं।',
    chatPlaceholder: 'एआईदे पुच्छो...', points: 'नागरिक पॉइंट', badge: 'नागरिक चैंपियन',
    recent: 'हालिया गतिविधि', resolve: 'औसत समाधान', emergency: '🚨 आपातकाल',
    duplicate: 'नजदीक इहा शिकायत मिली!',
    gpsLabel: 'ऑटो GPS थाह', gpsAccurate: '100% सही',
    langTitle: 'आपनी भाषा चुनो', searchLang: 'भाषा खोजो...',
    step1: 'शिकायत दर्ज', step2: 'अधिकारीने स्वीकार कित्ता', step3: 'कामगार भेजे',
    step4: 'काम पूरा & रेटिंग', voiceText: 'मुख्य सड़के च खतरनाक गड्ढा ऐ।',
  },
  MNI: {
    title: 'ꯁꯤꯚꯤꯛꯑꯥꯏ', subtitle: 'AI ꯁꯤꯖꯤꯟꯅꯔꯕꯥ ꯂꯝꯕꯤ ꯔꯤꯄꯣꯔꯇꯤꯡ',
    report: 'ꯔꯤꯄꯣꯔꯇ', track: 'ꯠꯔꯦꯛ', chat: 'ꯁꯔꯨꯛ', rewards: 'ꯄꯣꯏꯟꯇ',
    selectPhoto: 'ꯃꯁꯤꯒꯤ ꯐꯣꯇꯣ ꯁꯦꯟꯕꯤꯌꯨ:', aiRunning: 'AI ꯄꯥꯎꯈꯩꯔꯩ...',
    verified: '✓ ꯑꯁꯤꯒꯨꯝꯕꯥ ꯂꯝꯕꯤ ꯃꯁꯤꯒꯤ', category: 'ꯁ꯭ꯔꯦꯅꯤ', dept: 'ꯗꯤꯄꯥꯔꯇꯃꯦꯟꯇ',
    notes: 'ꯁꯤꯀꯥꯌꯇ ꯅꯣꯇ', voiceBtn: '🎙 ꯃꯥꯢꯔꯧꯕꯒꯤ ꯏꯟꯄꯨꯠ', listening: '⏺ ꯍꯧꯖꯤꯛꯀꯤ...',
    submit: 'ꯃꯨꯅꯤꯁꯤꯄꯦꯜꯇꯤꯒꯤ ꯁꯕꯃꯤꯠ', noPhoto: 'ꯐꯣꯇꯣ ꯍꯟꯗꯛꯇꯥ ꯁꯦꯟꯕꯤꯌꯨ।',
    trackTitle: 'ꯞꯂꯥꯏꯚ ꯠꯔꯦꯀꯤꯡ', chatGreet: 'ꯍꯦꯜꯂꯣ! ꯑꯩ CivicEye AI।',
    chatPlaceholder: 'AI ꯗꯥ ꯑꯁꯤꯒꯨꯝꯅꯨ...', points: 'ꯂꯝꯕꯤ ꯄꯣꯏꯟꯇ', badge: 'ꯂꯝꯕꯤ ꯆꯥꯝꯄꯤꯌꯟ',
    recent: 'ꯍꯧꯖꯤꯛꯀꯤ ꯉꯥꯛꯁꯤꯟ', resolve: 'ꯑꯣꯐꯕꯥ ꯃꯥꯢꯊꯪ', emergency: '🚨 ꯑꯦꯃꯔꯖꯦꯟꯁꯤ',
    duplicate: 'ꯃꯃꯥꯡꯗꯥ ꯑꯁꯤꯒꯨꯝꯕꯥ ꯁꯤꯀꯥꯌꯇ ꯂꯣꯏꯔꯩ!',
    gpsLabel: 'ꯑꯣꯇꯣ GPS ꯂꯩꯐꯝ', gpsAccurate: '100% ꯑꯃꯨꯛꯅꯥ',
    langTitle: 'ꯑꯩꯈꯣꯏꯒꯤ ꯂꯣꯟ ꯁꯦꯟꯕꯤꯌꯨ', searchLang: 'ꯂꯣꯟ ꯍꯧꯖꯤꯛꯀꯤ...',
    step1: 'ꯁꯤꯀꯥꯌꯇ ꯁꯕꯃꯤꯠ', step2: 'ꯑꯅꯨꯝꯕꯥ ꯑꯧꯔꯤꯕꯥ', step3: 'ꯋꯥꯔꯀꯔ ꯄꯦꯡꯊꯪꯕꯥ',
    step4: 'ꯉꯥꯛꯁꯤꯟ ꯁꯥꯒꯠꯈꯤ & ꯔꯦꯇꯤꯡ', voiceText: 'ꯃꯔꯨ ꯂꯝꯗꯥ ꯑꯃꯨꯛ ꯒꯤ ꯀꯥꯂꯩ ꯂꯩ।',
  },
  BRX: {
    title: 'सिभिकआई', subtitle: 'एआई गोनां नागरिक रिपोर्टिं',
    report: 'रिपोर्ट', track: 'ट्रैक', chat: 'जायखि', rewards: 'पोइंट',
    selectPhoto: 'गोसो फटो दानसे:', aiRunning: 'एआई बिसलेषन जाबाय...',
    verified: '✓ सत्थाय नागरिक गोसो दोरोन', category: 'बिसोर', dept: 'बिभाग',
    notes: 'तक्रार नोट', voiceBtn: '🎙 जांब इनपुट', listening: '⏺ बुजिनो...',
    submit: 'नगरपालिका आ सबमिट', noPhoto: 'थारि फटो दानसे।',
    trackTitle: 'लाइब ट्रैकिं', chatGreet: 'नमस्कार! बि CivicEye AI आं।',
    chatPlaceholder: 'एआईदे बुसो...', points: 'नागरिक पोइंट', badge: 'नागरिक चैंपियन',
    recent: 'थांखि काज', resolve: 'माजाब समाधान', emergency: '🚨 फोरमाय',
    duplicate: 'जेगो सेखो तक्रार आगो!',
    gpsLabel: 'ऑटो GPS थाव', gpsAccurate: '100% सोमोनाय',
    langTitle: 'नों भाषा दानसे', searchLang: 'भाषा खोज...',
    step1: 'तक्रार दाखोल', step2: 'अधिकारी लानाय', step3: 'कामसालि बिखाव',
    step4: 'काज सिखानाय & रेटिं', voiceText: 'गोदान सोरणिआव बांग्लो खाव आ।',
  },
  SA: {
    title: 'सिविकनेत्र', subtitle: 'कृत्रिमबुद्धि-सहायित नागरिक-प्रतिवेदन',
    report: 'प्रतिवेदनम्', track: 'अनुवर्तनम्', chat: 'सहायता', rewards: 'अङ्काः',
    selectPhoto: 'समस्यायाः चित्रं चिनुत:', aiRunning: 'कृत्रिमबुद्धि-विश्लेषणं चलति...',
    verified: '✓ वास्तविका नागरिकसमस्या प्रमाणिता', category: 'श्रेणी', dept: 'विभागः',
    notes: 'प्रतिवेदन-टिप्पणी', voiceBtn: '🎙 स्वरनिवेशः', listening: '⏺ शृणोमि...',
    submit: 'नगरपालिकायां प्रेषयतु', noPhoto: 'कृपया प्रथमं चित्रं चिनुत।',
    trackTitle: 'सरल-अनुवर्तनम्', chatGreet: 'नमस्ते! अहं CivicEye AI अस्मि।',
    chatPlaceholder: 'AI पृच्छतु...', points: 'नागरिकाङ्काः', badge: 'नागरिक-विजेता',
    recent: 'नूतना-कार्याणि', resolve: 'औसत-समाधानम्', emergency: '🚨 आपत्कालः',
    duplicate: 'समीपे सदृशी समस्या ज्ञाता!',
    gpsLabel: 'स्वयंचालित GPS स्थानम्', gpsAccurate: '100% यथार्थम्',
    langTitle: 'स्वभाषां चिनुत', searchLang: 'भाषाः अन्वेषयतु...',
    step1: 'प्रतिवेदनं प्रेषितम्', step2: 'अधिकारी स्वीकृतवान्', step3: 'कर्मचारी प्रेषिताः',
    step4: 'कार्यं पूर्णं च मूल्यांकनम्', voiceText: 'मुख्यमार्गे महती गर्ता वर्तते।',
  },
};

// Photo Presets
const photoPresets = [
  { id: 'pothole',  name: 'Pothole Issue',   url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600', category: 'Pothole',        priority: 'HIGH',     dept: 'Highways Dept',     confidence: 96.5, isDuplicate: true,  duplicateDist: 14.2, duplicateCode: 'CIV-2026-1001' },
  { id: 'garbage',  name: 'Garbage Dump',    url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600', category: 'Garbage',        priority: 'MEDIUM',   dept: 'Municipality',      confidence: 95.8, isDuplicate: false },
  { id: 'water',    name: 'Water Pipe Leak', url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600', category: 'Water Leakage', priority: 'HIGH',     dept: 'Water Supply Board', confidence: 94.1, isDuplicate: false },
  { id: 'sewage',   name: 'Sewage Hazard',   url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600', category: 'Sewage Overflow',priority: 'CRITICAL', dept: 'Water Supply Board', confidence: 93.5, isDuplicate: false },
];

// Priority badge colors
const PRIORITY_COLOR = { CRITICAL: 'text-rose-400', HIGH: 'text-orange-400', MEDIUM: 'text-amber-400', LOW: 'text-emerald-400' };

// ─────────────────────────────────────────────
// LANGUAGE PICKER COMPONENT
// Full-screen beautiful language selection drawer
// ─────────────────────────────────────────────
const LanguagePicker = ({ currentLang, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const t = T[currentLang] || T.EN;

  const filtered = INDIAN_LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.includes(search) ||
    l.region.toLowerCase().includes(search.toLowerCase()) ||
    l.script.toLowerCase().includes(search.toLowerCase())
  );

  const scriptGroups = ['Devanagari', 'Dravidian', 'Eastern', 'Western', 'Perso-Arabic', 'Other'];
  const getGroup = (lang) => {
    if (['HI','MR','NE','MAI','KOK','DOI','BRX','SA'].includes(lang.code)) return 'Devanagari';
    if (['TA','TE','KN','ML'].includes(lang.code)) return 'Dravidian';
    if (['BN','AS','MNI'].includes(lang.code)) return 'Eastern';
    if (['GU','PA','OR'].includes(lang.code)) return 'Western';
    if (['UR','KS','SD'].includes(lang.code)) return 'Perso-Arabic (RTL)';
    return 'Other';
  };

  return (
    <div
      className="absolute inset-0 bg-slate-950 rounded-[45px] flex flex-col p-4"
      style={{ zIndex: 999, animation: 'slideInFromBottom4 0.25s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pt-5">
        <div className="flex items-center space-x-2">
          <Languages className="w-5 h-5 text-sky-400" />
          <div>
            <p className="text-white font-extrabold text-sm">{t.langTitle}</p>
            <p className="text-slate-400 text-[10px]">22 Official Indian Languages + English</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          autoFocus
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.searchLang}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      {/* Current Language Badge */}
      {!search && (
        <div className="mb-2 px-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1.5">Currently Active</p>
          <div className="bg-sky-600/20 border border-sky-500/40 rounded-xl p-2.5 flex items-center space-x-3">
            <div className="w-8 h-8 bg-sky-600 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0">
              {currentLang.slice(0,2)}
            </div>
            <div>
              <p className="text-sky-300 font-bold text-xs">{INDIAN_LANGUAGES.find(l=>l.code===currentLang)?.name}</p>
              <p className="text-sky-500 text-[10px]">{INDIAN_LANGUAGES.find(l=>l.code===currentLang)?.native}</p>
            </div>
            <CheckCircle2 className="w-4 h-4 text-sky-400 ml-auto" />
          </div>
        </div>
      )}

      {/* Language List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {search ? (
          filtered.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">No language found</div>
          ) : filtered.map(lang => (
            <LangItem key={lang.code} lang={lang} currentLang={currentLang} onSelect={onSelect} />
          ))
        ) : (
          ['Devanagari', 'Dravidian', 'Eastern', 'Western', 'Perso-Arabic (RTL)', 'Other'].map(group => {
            const items = INDIAN_LANGUAGES.filter(l => getGroup(l) === group);
            if (!items.length) return null;
            return (
              <div key={group} className="mb-2">
                <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold px-1 py-1.5 sticky top-0 bg-slate-950">
                  {group} Script
                </p>
                {items.map(lang => (
                  <LangItem key={lang.code} lang={lang} currentLang={currentLang} onSelect={onSelect} />
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Constitution Note */}
      <div className="mt-2 pt-2 border-t border-slate-800 text-[9px] text-slate-600 text-center leading-relaxed">
        🇮🇳 All 22 languages listed in the 8th Schedule of the Indian Constitution
      </div>
    </div>
  );
};

const LangItem = ({ lang, currentLang, onSelect }) => {
  const isActive = lang.code === currentLang;
  return (
    <button
      onClick={() => onSelect(lang.code)}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all text-left ${
        isActive
          ? 'bg-sky-600 text-white'
          : 'hover:bg-slate-800/80 text-slate-300'
      }`}
    >
      {/* Code Badge */}
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
        isActive ? 'bg-white/20' : 'bg-slate-800'
      }`}>
        {lang.code.slice(0,2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
            {lang.name}
          </p>
          {lang.rtl && (
            <span className="text-[8px] bg-amber-500/20 text-amber-400 px-1 py-0.5 rounded font-bold shrink-0">RTL</span>
          )}
        </div>
        <p className={`text-[11px] truncate ${isActive ? 'text-sky-200' : 'text-slate-400'}`}>
          {lang.native} · {lang.region}
        </p>
      </div>
      {isActive && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
    </button>
  );
};

// ─────────────────────────────────────────────
// MAIN CITIZEN APP MODAL
// ─────────────────────────────────────────────
export const CitizenAppModal = ({ onClose, onAddComplaint }) => {
  const [activeTab, setActiveTab] = useState('REPORT');
  const [language, setLanguage]   = useState('EN');
  const [showLangPicker, setShowLangPicker] = useState(false);
  const t = T[language] || T.EN;
  const currentLangMeta = INDIAN_LANGUAGES.find(l => l.code === language) || INDIAN_LANGUAGES[0];
  const isRTL = currentLangMeta.rtl;

  const [selectedPhoto, setSelectedPhoto]     = useState(null);
  const [aiPrediction, setAiPrediction]       = useState(null);
  const [isAiLoading, setIsAiLoading]         = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [description, setDescription]         = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [submittedCode, setSubmittedCode]     = useState(null);
  const [chatMessages, setChatMessages]       = useState([]);
  const [chatInput, setChatInput]             = useState('');
  const [userRating, setUserRating]           = useState(0);

  // Reset chat greeting when language changes
  useEffect(() => {
    setChatMessages([{ sender: 'AI', text: (T[language] || T.EN).chatGreet }]);
  }, [language]);

  const handleSelectPreset = (preset) => {
    setSelectedPhoto(preset);
    setIsAiLoading(true);
    setDuplicateWarning(null);
    setTimeout(() => {
      setIsAiLoading(false);
      setAiPrediction({
        category: preset.category, confidence: preset.confidence,
        priority: preset.priority, dept: preset.dept,
        alternatives: [{ category: 'Road Damage', conf: 0.88 }, { category: 'Open Drain', conf: 0.12 }]
      });
      if (preset.isDuplicate) {
        setDuplicateWarning(t.duplicate + ` (${preset.duplicateCode} · ${preset.duplicateDist}m)`);
      }
    }, 900);
  };

  const handleVoiceRecord = () => {
    setIsVoiceRecording(true);
    setTimeout(() => {
      setIsVoiceRecording(false);
      setDescription((T[language] || T.EN).voiceText);
    }, 1600);
  };

  const handleSubmitComplaint = () => {
    if (!selectedPhoto || !aiPrediction) return;
    const code = `CIV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedCode(code);
    const newComp = {
      id: Date.now(), tracking_code: code,
      title: description || `${aiPrediction.category} Issue Reported`,
      description: description || 'Reported via CivicEye Mobile App with AI auto-verification.',
      category: aiPrediction.category, priority: aiPrediction.priority, status: 'SUBMITTED',
      latitude: 13.0827 + (Math.random() * 0.01), longitude: 80.2707 + (Math.random() * 0.01),
      address: 'Auto GPS: Zone 1, Main Road', zone_name: 'Central Zone',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 16),
      citizen_name: 'Priya Ramesh', citizen_phone: '+91 98765 43210',
      department: aiPrediction.dept, image_url: selectedPhoto.url,
      ai_confidence: aiPrediction.confidence,
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${code}`,
      language_reported: language,
      history: [{ status: 'SUBMITTED', timestamp: 'Just Now', notes: 'AI verified & submitted', updated_by: 'Citizen Mobile App' }]
    };
    onAddComplaint(newComp);
    setActiveTab('TRACK');
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages(prev => [...prev, { sender: 'USER', text: userText }]);
    setChatInput('');
    setTimeout(() => {
      const txt = userText.toLowerCase();
      let botReply = t.chatGreet;
      if (txt.includes('status') || txt.includes('where') || txt.includes('civ-') || txt.includes('कहाँ') || txt.includes('நிலை') || txt.includes('स्थिति')) {
        botReply = `📌 ${t.trackTitle}: SUBMITTED → Officer Notified. Est. Resolution: 12 Hours.`;
      } else if (txt.includes('time') || txt.includes('eta') || txt.includes('long') || txt.includes('समय') || txt.includes('நேரம்')) {
        botReply = '⏱️ SLA: Critical=6h · High=12h · Medium=48h · Low=72h';
      } else if (txt.includes('emergency') || txt.includes('number') || txt.includes('helpline') || txt.includes('आपातकाल') || txt.includes('அவசரம்')) {
        botReply = '🚨 24/7 Helplines: Municipal Control Room 1800-425-0011 · Sewage 1916 · Water 1800-345-3747';
      }
      setChatMessages(prev => [...prev, { sender: 'AI', text: botReply }]);
    }, 700);
  };

  const handleLanguageSelect = (code) => {
    setLanguage(code);
    setShowLangPicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      {/* Phone Frame */}
      <div
        className="w-[380px] bg-slate-900 rounded-[45px] p-4 ring-8 ring-slate-800 shadow-2xl flex flex-col justify-between relative border border-slate-700/80"
        style={{ height: '740px', animation: 'zoomIn95 0.2s cubic-bezier(0.16,1,0.3,1) both' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Language Picker Overlay */}
        {showLangPicker && (
          <LanguagePicker
            currentLang={language}
            onSelect={handleLanguageSelect}
            onClose={() => setShowLangPicker(false)}
          />
        )}

        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-full flex items-center justify-center z-40">
          <div className="w-3 h-3 rounded-full bg-slate-800 mr-2"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping"></div>
        </div>

        {/* Mobile Header */}
        <div className="pt-5 px-3 pb-3 border-b border-slate-800 flex items-center justify-between text-white text-xs">
          <div className="flex items-center space-x-1.5">
            <Shield className="w-4 h-4 text-sky-400" />
            <span className="font-bold tracking-tight">{t.title}</span>
          </div>

          {/* Language Selector Button */}
          <button
            onClick={() => setShowLangPicker(true)}
            title="Change Language — Tap to select from all 23 Indian languages"
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              background: 'linear-gradient(135deg, #0c4a6e 0%, #312e81 100%)',
              border: '1.5px solid #38bdf8',
              borderRadius: '999px', padding: '5px 10px',
              cursor: 'pointer', direction: 'ltr',
              boxShadow: '0 0 8px rgba(56,189,248,0.35)'
            }}
          >
            <Globe style={{ width: 12, height: 12, color: '#38bdf8' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#7dd3fc', maxWidth: 64, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', direction: 'ltr' }}>
              {currentLangMeta.native}
            </span>
            <span style={{ fontSize: 9, color: '#7dd3fc' }}>▾</span>
          </button>

          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
        </div>

        {/* Screen Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">

          {/* ── TAB 1: REPORT ── */}
          {activeTab === 'REPORT' && (
            <div className="space-y-3.5">
              <div className="bg-gradient-to-r from-sky-900/50 to-indigo-900/50 p-3 rounded-2xl border border-sky-500/30 text-sky-100">
                <p className="font-bold text-xs flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sky-400 animate-pulse" />
                  {t.subtitle}
                </p>
                <p className="text-[10px] opacity-70 mt-0.5">Snap photo → AI verifies → Auto-routes to dept.</p>
              </div>

              {/* Photo Grid */}
              <div>
                <p className="font-bold text-slate-300 text-[11px] mb-2 flex items-center">
                  <Camera className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {t.selectPhoto}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {photoPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                        selectedPhoto?.id === preset.id
                          ? 'bg-sky-600/30 border-sky-500 ring-2 ring-sky-500/50'
                          : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="font-bold text-[10px] text-white truncate">{preset.name}</p>
                        <span className={`text-[9px] font-semibold ${PRIORITY_COLOR[preset.priority]}`}>
                          {preset.priority}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Analysis */}
              {isAiLoading && (
                <div className="p-4 bg-slate-800 rounded-2xl text-center border border-slate-700 space-y-2">
                  <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-[11px] text-sky-400 font-bold">{t.aiRunning}</p>
                </div>
              )}

              {aiPrediction && !isAiLoading && (
                <div className="bg-slate-800/80 p-3 rounded-2xl border border-emerald-500/40 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />{t.verified}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                      {aiPrediction.confidence}%
                    </span>
                  </div>
                  {/* Confidence Bar */}
                  <div className="w-full h-1.5 bg-slate-700 rounded-full">
                    <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transition-all" style={{ width: `${aiPrediction.confidence}%` }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] pt-0.5">
                    <div><p className="text-slate-400">{t.category}:</p><p className="font-bold text-white">{aiPrediction.category}</p></div>
                    <div><p className="text-slate-400">{t.dept}:</p><p className="font-bold text-sky-400 text-[9px] leading-tight">{aiPrediction.dept}</p></div>
                  </div>
                </div>
              )}

              {/* Duplicate Warning */}
              {duplicateWarning && (
                <div className="p-2.5 bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-200 text-[10px] flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              {/* Voice + Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 font-bold text-[11px]">{t.notes}</span>
                  <button
                    onClick={handleVoiceRecord}
                    className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      isVoiceRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-sky-400 border border-slate-700'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isVoiceRecording ? t.listening : t.voiceBtn}</span>
                  </button>
                </div>
                <textarea
                  rows="2"
                  placeholder="Type issue description or tap voice input..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
                />
              </div>

              {/* GPS Badge */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 bg-slate-800/40 p-2 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{t.gpsLabel}: 13.0827°N, 80.2707°E</span>
                </div>
                <span className="text-emerald-400 font-bold">{t.gpsAccurate}</span>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmitComplaint}
                disabled={!selectedPhoto || isAiLoading}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-2xl text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
              >
                <span>{t.submit}</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              {!selectedPhoto && (
                <p className="text-[10px] text-slate-500 text-center">{t.noPhoto}</p>
              )}
            </div>
          )}

          {/* ── TAB 2: TRACK ── */}
          {activeTab === 'TRACK' && (
            <div className="space-y-3.5">
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sky-400 text-[11px]">{submittedCode || 'CIV-2026-1001'}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">IN_PROGRESS</span>
                </div>
                <h4 className="font-bold text-white text-xs">Pothole Repair — Main Road</h4>
                <p className="text-[10px] text-slate-400">Highways Dept · SLA: 12h · {t.resolve}: ~8h</p>
                {/* QR Code */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${submittedCode || 'CIV-2026-1001'}`}
                  alt="QR"
                  className="w-14 h-14 rounded-lg border border-slate-600 mx-auto mt-1"
                />
              </div>

              {/* Timeline */}
              <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-4">
                <h5 className="font-bold text-slate-300 text-[11px] flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-sky-400" /> {t.trackTitle}
                </h5>
                <div className="relative pl-5 space-y-4 border-l-2 border-slate-700">
                  {[
                    { step: t.step1, sub: 'AI Verified & Auto-routed', done: true, active: false },
                    { step: t.step2, sub: 'Insp. K. Arumugam', done: true, active: false },
                    { step: t.step3, sub: 'Team Alpha on site', done: false, active: true },
                    { step: t.step4, sub: 'Citizen photo verification', done: false, active: false },
                  ].map((item, i) => (
                    <div key={i} className={`relative ${!item.done && !item.active ? 'opacity-50' : ''}`}>
                      <div className={`absolute -left-[27px] top-0 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${
                        item.done ? 'bg-emerald-500' : item.active ? 'bg-sky-500 animate-ping' : 'bg-slate-700'
                      }`}>
                        {item.done ? '✓' : ''}
                      </div>
                      <p className={`font-bold text-[11px] ${item.active ? 'text-sky-400' : item.done ? 'text-white' : 'text-slate-400'}`}>{i+1}. {item.step}</p>
                      <p className="text-[10px] text-slate-400">{item.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rate Section */}
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                <p className="text-[11px] font-bold text-slate-300 mb-2">Rate this service</p>
                <div className="flex space-x-1.5">
                  {[1,2,3,4,5].map(s => (
                    <button key={s} onClick={() => setUserRating(s)}>
                      <Star className={`w-5 h-5 ${s <= userRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: AI CHATBOT ── */}
          {activeTab === 'CHAT' && (
            <div className="h-[480px] flex flex-col justify-between space-y-2">
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'AI' && (
                      <div className="w-6 h-6 bg-sky-600 rounded-full flex items-center justify-center mr-1.5 shrink-0 mt-0.5">
                        <Bot className="w-3.5 h-3.5 text-white" />
                      </div>
                    )}
                    <div className={`p-2.5 rounded-2xl max-w-[80%] text-[11px] leading-relaxed ${
                      msg.sender === 'USER'
                        ? 'bg-sky-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
                    }`} dir={isRTL ? 'rtl' : 'ltr'}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Chips */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[9px] shrink-0">
                {[
                  { label: '📍 Status', val: 'Where is my complaint?' },
                  { label: '⏱ ETA',    val: 'How long will it take?' },
                  { label: '🚨 Help',   val: 'Emergency helpline number' },
                ].map(chip => (
                  <button key={chip.label} onClick={() => setChatInput(chip.val)}
                    className="bg-slate-800 text-sky-400 px-2.5 py-1 rounded-full border border-slate-700 whitespace-nowrap font-semibold hover:border-sky-500 transition-all">
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <input
                  type="text"
                  placeholder={t.chatPlaceholder}
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button onClick={handleSendChat} className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 4: REWARDS ── */}
          {activeTab === 'REWARDS' && (
            <div className="space-y-4 py-2">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto text-slate-900 shadow-xl shadow-amber-500/30 mb-2">
                  <Award className="w-10 h-10" />
                </div>
                <h4 className="text-lg font-extrabold text-white">135 {t.points}</h4>
                <p className="text-xs text-amber-400 font-bold">{t.badge} · Level 2</p>
                <p className="text-[10px] text-slate-400 mt-1">Keep reporting to earn more rewards!</p>
              </div>

              {/* XP Bar */}
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>Level 2</span><span>135 / 200 XP</span><span>Level 3</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full">
                  <div className="h-2 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: '67%' }}></div>
                </div>
              </div>

              {/* Badges */}
              <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 space-y-2">
                <p className="text-[11px] font-bold text-slate-300">{t.recent}</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: '🛡️', label: 'Pothole Sentinel', pts: '+20' },
                    { icon: '🌱', label: 'Green Inspector',   pts: '+15' },
                    { icon: '⚡', label: 'Quick Reporter',    pts: '+10' },
                    { icon: '🗺️', label: 'GPS Pioneer',       pts: '+25' },
                  ].map(badge => (
                    <div key={badge.label} className="bg-slate-900 rounded-xl p-2.5 flex items-center space-x-2 border border-slate-700/50">
                      <span className="text-base">{badge.icon}</span>
                      <div>
                        <p className="text-[10px] font-bold text-white leading-tight">{badge.label}</p>
                        <p className="text-[9px] text-amber-400 font-bold">{badge.pts} XP</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { val: '7', label: 'Reports' },
                  { val: '5', label: 'Resolved' },
                  { val: '4.8★', label: 'Rating' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-800 rounded-xl p-2 border border-slate-700">
                    <p className="text-sm font-extrabold text-sky-400">{s.val}</p>
                    <p className="text-[9px] text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Emergency Numbers */}
              <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-3 space-y-1.5">
                <p className="text-[11px] font-bold text-rose-300 flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1.5" />{t.emergency} Helplines
                </p>
                {[
                  { name: 'Municipal Control Room', no: '1800-425-0011' },
                  { name: 'Sewage Emergency', no: '1916' },
                  { name: 'Water Supply Board', no: '1800-345-3747' },
                ].map(e => (
                  <div key={e.name} className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">{e.name}</span>
                    <span className="font-mono font-bold text-rose-300">{e.no}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="pt-2 pb-1 border-t border-slate-800 grid grid-cols-4 gap-1 text-[10px]">
          {[
            { tab: 'REPORT',  icon: Camera,  label: t.report  },
            { tab: 'TRACK',   icon: History, label: t.track   },
            { tab: 'CHAT',    icon: Bot,     label: t.chat    },
            { tab: 'REWARDS', icon: Award,   label: t.rewards },
          ].map(({ tab, icon: Icon, label }) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center p-1 font-bold transition-all ${activeTab === tab ? 'text-sky-400' : 'text-slate-500'}`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${activeTab === tab ? 'scale-110' : ''} transition-transform`} />
              <span className="truncate max-w-[50px]">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
