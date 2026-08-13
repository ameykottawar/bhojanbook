import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'mr';

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  mr: 'मराठी',
};

// Translation keys
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.punchMeal': 'Punch Meal',
    'nav.students': 'Students',
    'nav.billing': 'Billing',
    'nav.settings': 'Settings',
    
    // Home page
    'home.title': 'TiffinTracker',
    'home.subtitle': 'Manage your mess efficiently',
    'home.normalBilling': 'Normal Billing',
    'home.normalBillingDesc': 'Quick billing for walk-in customers',
    'home.startBilling': 'Start Billing',
    'home.registeredStudents': 'Registered Students',
    'home.registeredStudentsDesc': 'Manage your monthly subscribers',
    'home.manageStudents': 'Manage Students',
    'home.selectDate': 'Select Date',
    'home.todaysMeals': "Today's Meals",
    'home.todaysRevenue': "Today's Revenue",
    'home.mealsPunched': 'Meals Punched',
    'home.dateSummary': 'Date Summary',
    
    // Landing page
    'landing.tagline': 'Mess Management Made Simple',
    'landing.heroTitle': 'Run your mess or tiffin service with ease',
    'landing.heroSubtitle': 'BhojanBook helps you track daily meals, manage student subscriptions, generate monthly bills, and create PDF invoices in minutes.',
    'landing.getStarted': 'Get Started',
    'landing.benefit1': 'Track daily meals with one tap',
    'landing.benefit2': 'Manage student records and subscriptions',
    'landing.benefit3': 'Generate PDF invoices instantly',
    'landing.benefit4': 'Available in English, Hindi & Marathi',
    'landing.featuresTitle': 'Everything you need',
    'landing.featuresSubtitle': 'A simple yet powerful tool designed for mess and tiffin service owners.',
    'landing.featureMealTitle': 'Meal Punching',
    'landing.featureMealDesc': 'Record mini, full, and special meals quickly with add-ons and notes.',
    'landing.featureStudentsTitle': 'Student Management',
    'landing.featureStudentsDesc': 'Keep student details, contact info, and subscription history in one place.',
    'landing.featureBillingTitle': 'Billing & Invoices',
    'landing.featureBillingDesc': 'Generate monthly bills and download PDF invoices for any student.',
    'landing.featureLanguageTitle': 'Multilingual',
    'landing.featureLanguageDesc': 'Use the app in English, Hindi, or Marathi as per your comfort.',
    'landing.ctaTitle': 'Ready to simplify your mess?',
    'landing.ctaSubtitle': 'Join BhojanBook today and focus on serving great food, not paperwork.',
    'landing.startFree': 'Start for Free',
    'landing.footer': 'Made for mess and tiffin service owners.',
    
    // Students page
    'students.title': 'Students',
    'students.subtitle': 'Manage your registered students',
    'students.addStudent': 'Add Student',
    'students.noStudents': 'No students registered yet',
    'students.addFirstStudent': 'Add your first student to get started',
    'students.name': 'Name',
    'students.phone': 'Phone',
    'students.email': 'Email',
    'students.address': 'Address',
    'students.startDate': 'Start Date',
    'students.lastPayment': 'Last Payment',
    'students.edit': 'Edit',
    'students.delete': 'Delete',
    'students.save': 'Save',
    'students.cancel': 'Cancel',
    
    // Punch Meal page
    'punch.title': 'Punch Meal',
    'punch.subtitle': 'Record a meal for a student',
    'punch.selectStudent': 'Select Student',
    'punch.selectMeal': 'Select Meal Type',
    'punch.addons': 'Add-ons',
    'punch.notes': 'Notes (optional)',
    'punch.punchMeal': 'Punch Meal',
    'punch.success': 'Meal punched successfully',
    
    // Meal types
    'meal.mini': 'Mini Meal',
    'meal.full': 'Full Meal',
    'meal.special': 'Special Meal',
    
    // Billing page
    'billing.title': 'Billing',
    'billing.subtitle': 'Generate bills for students',
    'billing.selectStudent': 'Select Student',
    'billing.selectMonth': 'Select Month',
    'billing.summary': 'Billing Summary',
    'billing.totalMeals': 'Total Meals',
    'billing.totalAmount': 'Total Amount',
    'billing.addonsTotal': 'Add-ons Total',
    'billing.generatePdf': 'Generate PDF Invoice',
    'billing.noMeals': 'No meals found for this period',
    
    // Settings page
    'settings.title': 'Settings',
    'settings.subtitle': 'Configure your mess details and pricing',
    'settings.messDetails': 'Mess Details',
    'settings.messDetailsDesc': 'These details will appear on your PDF invoices',
    'settings.messName': 'Mess Name',
    'settings.address': 'Address',
    'settings.contact': 'Contact Number',
    'settings.upiId': 'UPI ID (for payment QR)',
    'settings.mealPricing': 'Meal Pricing',
    'settings.mealPricingDesc': 'Set custom prices for each meal type',
    'settings.language': 'Language',
    'settings.languageDesc': 'Choose your preferred language',
    'settings.save': 'Save Settings',
    'settings.reset': 'Reset',
    'settings.saved': 'Settings saved successfully',
    'settings.resetSuccess': 'Settings reset to defaults',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.save': 'Save',
    'common.close': 'Close',
    
    // Auth
    'auth.login': 'Login',
    'auth.signup': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.loginSubtitle': 'Sign in to manage your mess',
    'auth.signupSubtitle': 'Create an account to get started',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginSuccess': 'Logged in successfully',
    'auth.signupSuccess': 'Account created successfully',
    'auth.logoutSuccess': 'Logged out successfully',
    'auth.invalidCredentials': 'Invalid email or password',
    'auth.alreadyRegistered': 'This email is already registered',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.resetPassword': 'Reset Password',
    'auth.forgotSubtitle': 'Enter your email to receive a reset link',
    'auth.resetSubtitle': 'Enter your new password',
    'auth.sendResetLink': 'Send Reset Link',
    'auth.updatePassword': 'Update Password',
    'auth.newPassword': 'New Password',
    'auth.resetEmailSent': 'Password reset email sent! Check your inbox.',
    'auth.passwordUpdated': 'Password updated successfully',
    'auth.backToLogin': 'Back to Login',
    
    // Settings
    'settings.account': 'Account',
    'settings.accountDesc': 'Manage your account settings',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.punchMeal': 'भोजन पंच',
    'nav.students': 'छात्र',
    'nav.billing': 'बिलिंग',
    'nav.settings': 'सेटिंग्स',
    
    // Home page
    'home.title': 'टिफिनट्रैकर',
    'home.subtitle': 'अपने मेस को कुशलता से प्रबंधित करें',
    'home.normalBilling': 'सामान्य बिलिंग',
    'home.normalBillingDesc': 'वॉक-इन ग्राहकों के लिए त्वरित बिलिंग',
    'home.startBilling': 'बिलिंग शुरू करें',
    'home.registeredStudents': 'पंजीकृत छात्र',
    'home.registeredStudentsDesc': 'अपने मासिक ग्राहकों को प्रबंधित करें',
    'home.manageStudents': 'छात्र प्रबंधित करें',
    'home.selectDate': 'तारीख चुनें',
    'home.todaysMeals': 'आज के भोजन',
    'home.todaysRevenue': 'आज की आय',
    'home.mealsPunched': 'भोजन पंच किए गए',
    'home.dateSummary': 'तारीख सारांश',
    
    // Landing page
    'landing.tagline': 'मेस प्रबंधन आसान बनाया',
    'landing.heroTitle': 'अपने मेस या टिफिन सेवा को आसानी से चलाएं',
    'landing.heroSubtitle': 'भोजनबुक आपको दैनिक भोजन ट्रैक करने, छात्र सदस्यताएं प्रबंधित करने, मासिक बिल बनाने और PDF इनवॉइस बनाने में मदद करता है।',
    'landing.getStarted': 'शुरू करें',
    'landing.benefit1': 'एक टैप में दैनिक भोजन ट्रैक करें',
    'landing.benefit2': 'छात्र रिकॉर्ड और सदस्यताएं प्रबंधित करें',
    'landing.benefit3': 'तुरंत PDF इनवॉइस बनाएं',
    'landing.benefit4': 'अंग्रेजी, हिंदी और मराठी में उपलब्ध',
    'landing.featuresTitle': 'आपको जो कुछ भी चाहिए',
    'landing.featuresSubtitle': 'मेस और टिफिन सेवा मालिकों के लिए डिज़ाइन किया गया सरल और शक्तिशाली उपकरण।',
    'landing.featureMealTitle': 'भोजन पंचिंग',
    'landing.featureMealDesc': 'मिनी, फुल और विशेष भोजन को ऐड-ऑन और नोट्स के साथ जल्दी रिकॉर्ड करें।',
    'landing.featureStudentsTitle': 'छात्र प्रबंधन',
    'landing.featureStudentsDesc': 'छात्र विवरण, संपर्क जानकारी और सदस्यता इतिहास को एक ही जगह रखें।',
    'landing.featureBillingTitle': 'बिलिंग और इनवॉइस',
    'landing.featureBillingDesc': 'किसी भी छात्र के लिए मासिक बिल बनाएं और PDF इनवॉइस डाउनलोड करें।',
    'landing.featureLanguageTitle': 'बहुभाषी',
    'landing.featureLanguageDesc': 'अपनी सुविधा के अनुसार अंग्रेजी, हिंदी या मराठी में ऐप का उपयोग करें।',
    'landing.ctaTitle': 'अपने मेस को सरल बनाने के लिए तैयार हैं?',
    'landing.ctaSubtitle': 'आज ही भोजनबुक से जुड़ें और बढ़िया खाना परोसने पर ध्यान दें, कागजी कार्रवाई पर नहीं।',
    'landing.startFree': 'मुफ्त में शुरू करें',
    'landing.footer': 'मेस और टिफिन सेवा मालिकों के लिए बनाया गया।',
    
    // Students page
    'students.title': 'छात्र',
    'students.subtitle': 'अपने पंजीकृत छात्रों को प्रबंधित करें',
    'students.addStudent': 'छात्र जोड़ें',
    'students.noStudents': 'अभी तक कोई छात्र पंजीकृत नहीं है',
    'students.addFirstStudent': 'शुरू करने के लिए अपना पहला छात्र जोड़ें',
    'students.name': 'नाम',
    'students.phone': 'फोन',
    'students.email': 'ईमेल',
    'students.address': 'पता',
    'students.startDate': 'शुरुआत की तारीख',
    'students.lastPayment': 'अंतिम भुगतान',
    'students.edit': 'संपादित करें',
    'students.delete': 'हटाएं',
    'students.save': 'सहेजें',
    'students.cancel': 'रद्द करें',
    
    // Punch Meal page
    'punch.title': 'भोजन पंच',
    'punch.subtitle': 'छात्र के लिए भोजन रिकॉर्ड करें',
    'punch.selectStudent': 'छात्र चुनें',
    'punch.selectMeal': 'भोजन प्रकार चुनें',
    'punch.addons': 'ऐड-ऑन',
    'punch.notes': 'नोट्स (वैकल्पिक)',
    'punch.punchMeal': 'भोजन पंच करें',
    'punch.success': 'भोजन सफलतापूर्वक पंच किया गया',
    
    // Meal types
    'meal.mini': 'मिनी भोजन',
    'meal.full': 'पूर्ण भोजन',
    'meal.special': 'विशेष भोजन',
    
    // Billing page
    'billing.title': 'बिलिंग',
    'billing.subtitle': 'छात्रों के लिए बिल बनाएं',
    'billing.selectStudent': 'छात्र चुनें',
    'billing.selectMonth': 'महीना चुनें',
    'billing.summary': 'बिलिंग सारांश',
    'billing.totalMeals': 'कुल भोजन',
    'billing.totalAmount': 'कुल राशि',
    'billing.addonsTotal': 'ऐड-ऑन कुल',
    'billing.generatePdf': 'PDF इनवॉइस बनाएं',
    'billing.noMeals': 'इस अवधि के लिए कोई भोजन नहीं मिला',
    
    // Settings page
    'settings.title': 'सेटिंग्स',
    'settings.subtitle': 'अपने मेस का विवरण और मूल्य निर्धारण कॉन्फ़िगर करें',
    'settings.messDetails': 'मेस विवरण',
    'settings.messDetailsDesc': 'ये विवरण आपके PDF इनवॉइस पर दिखाई देंगे',
    'settings.messName': 'मेस का नाम',
    'settings.address': 'पता',
    'settings.contact': 'संपर्क नंबर',
    'settings.upiId': 'UPI ID (भुगतान QR के लिए)',
    'settings.mealPricing': 'भोजन मूल्य निर्धारण',
    'settings.mealPricingDesc': 'प्रत्येक भोजन प्रकार के लिए कस्टम मूल्य सेट करें',
    'settings.language': 'भाषा',
    'settings.languageDesc': 'अपनी पसंदीदा भाषा चुनें',
    'settings.save': 'सेटिंग्स सहेजें',
    'settings.reset': 'रीसेट',
    'settings.saved': 'सेटिंग्स सफलतापूर्वक सहेजी गईं',
    'settings.resetSuccess': 'सेटिंग्स डिफ़ॉल्ट पर रीसेट हो गईं',
    
    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'एक त्रुटि हुई',
    'common.confirm': 'पुष्टि करें',
    'common.cancel': 'रद्द करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.save': 'सहेजें',
    'common.close': 'बंद करें',
    
    // Auth
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.logout': 'लॉगआउट',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.loginSubtitle': 'अपने मेस को प्रबंधित करने के लिए साइन इन करें',
    'auth.signupSubtitle': 'शुरू करने के लिए एक खाता बनाएं',
    'auth.noAccount': 'खाता नहीं है?',
    'auth.hasAccount': 'पहले से खाता है?',
    'auth.loginSuccess': 'सफलतापूर्वक लॉग इन किया',
    'auth.signupSuccess': 'खाता सफलतापूर्वक बनाया गया',
    'auth.logoutSuccess': 'सफलतापूर्वक लॉग आउट किया',
    'auth.invalidCredentials': 'अमान्य ईमेल या पासवर्ड',
    'auth.alreadyRegistered': 'यह ईमेल पहले से पंजीकृत है',
    'auth.forgotPassword': 'पासवर्ड भूल गए?',
    'auth.resetPassword': 'पासवर्ड रीसेट करें',
    'auth.forgotSubtitle': 'रीसेट लिंक प्राप्त करने के लिए अपना ईमेल दर्ज करें',
    'auth.resetSubtitle': 'अपना नया पासवर्ड दर्ज करें',
    'auth.sendResetLink': 'रीसेट लिंक भेजें',
    'auth.updatePassword': 'पासवर्ड अपडेट करें',
    'auth.newPassword': 'नया पासवर्ड',
    'auth.resetEmailSent': 'पासवर्ड रीसेट ईमेल भेजा गया! अपना इनबॉक्स जांचें।',
    'auth.passwordUpdated': 'पासवर्ड सफलतापूर्वक अपडेट किया गया',
    'auth.backToLogin': 'लॉगिन पर वापस जाएं',
    
    // Settings
    'settings.account': 'खाता',
    'settings.accountDesc': 'अपनी खाता सेटिंग्स प्रबंधित करें',
  },
  mr: {
    // Navigation
    'nav.home': 'होम',
    'nav.punchMeal': 'जेवण पंच',
    'nav.students': 'विद्यार्थी',
    'nav.billing': 'बिलिंग',
    'nav.settings': 'सेटिंग्ज',
    
    // Home page
    'home.title': 'टिफिनट्रॅकर',
    'home.subtitle': 'तुमचा मेस कार्यक्षमतेने व्यवस्थापित करा',
    'home.normalBilling': 'सामान्य बिलिंग',
    'home.normalBillingDesc': 'वॉक-इन ग्राहकांसाठी जलद बिलिंग',
    'home.startBilling': 'बिलिंग सुरू करा',
    'home.registeredStudents': 'नोंदणीकृत विद्यार्थी',
    'home.registeredStudentsDesc': 'तुमचे मासिक ग्राहक व्यवस्थापित करा',
    'home.manageStudents': 'विद्यार्थी व्यवस्थापित करा',
    'home.selectDate': 'तारीख निवडा',
    'home.todaysMeals': 'आजचे जेवण',
    'home.todaysRevenue': 'आजची कमाई',
    'home.mealsPunched': 'जेवण पंच केले',
    'home.dateSummary': 'तारीख सारांश',
    
    // Landing page
    'landing.tagline': 'मेस व्यवस्थापन सुलभ केले',
    'landing.heroTitle': 'तुमचा मेस किंवा टिफिन सेवा सहजपणे चालवा',
    'landing.heroSubtitle': 'भोजनबुक तुम्हाला दैनिक जेवण ट्रॅक करणे, विद्यार्थी सदस्यता व्यवस्थापित करणे, मासिक बिल तयार करणे आणि PDF इनव्हॉइस तयार करण्यास मदत करतो.',
    'landing.getStarted': 'सुरू करा',
    'landing.benefit1': 'एक टॅपमध्ये दैनिक जेवण ट्रॅक करा',
    'landing.benefit2': 'विद्यार्थी रेकॉर्ड आणि सदस्यता व्यवस्थापित करा',
    'landing.benefit3': 'तातडीने PDF इनव्हॉइस तयार करा',
    'landing.benefit4': 'इंग्रजी, हिंदी आणि मराठीमध्ये उपलब्ध',
    'landing.featuresTitle': 'तुम्हाला हवे असलेले सर्व काही',
    'landing.featuresSubtitle': 'मेस आणि टिफिन सेवा मालकांसाठी डिझाइन केलेले साधे आणि शक्तिशाली साधन.',
    'landing.featureMealTitle': 'जेवण पंचिंग',
    'landing.featureMealDesc': 'मिनी, फुल आणि विशेष जेवण ऍड-ऑन्स आणि नोट्ससह जलद नोंदवा.',
    'landing.featureStudentsTitle': 'विद्यार्थी व्यवस्थापन',
    'landing.featureStudentsDesc': 'विद्यार्थी तपशील, संपर्क माहिती आणि सदस्यता इतिहास एकाच ठिकाणी ठेवा.',
    'landing.featureBillingTitle': 'बिलिंग आणि इनव्हॉइस',
    'landing.featureBillingDesc': 'कोणत्याही विद्यार्थ्यासाठी मासिक बिल तयार करा आणि PDF इनव्हॉइस डाउनलोड करा.',
    'landing.featureLanguageTitle': 'बहुभाषिक',
    'landing.featureLanguageDesc': 'तुमच्या सोयीनुसार इंग्रजी, हिंदी किंवा मराठीमध्ये अॅप वापरा.',
    'landing.ctaTitle': 'तुमचा मेस सुलभ करण्यास तयार आहात?',
    'landing.ctaSubtitle': 'आजच भोजनबुकमध्ये सामील व्हा आणि उत्तम अन्न पुरवठ्यावर लक्ष केंद्रित करा, कागदपत्रे नाही.',
    'landing.startFree': 'मोफत सुरू करा',
    'landing.footer': 'मेस आणि टिफिन सेवा मालकांसाठी बनवलेले.',
    
    // Students page
    'students.title': 'विद्यार्थी',
    'students.subtitle': 'तुमचे नोंदणीकृत विद्यार्थी व्यवस्थापित करा',
    'students.addStudent': 'विद्यार्थी जोडा',
    'students.noStudents': 'अद्याप कोणताही विद्यार्थी नोंदणीकृत नाही',
    'students.addFirstStudent': 'सुरू करण्यासाठी तुमचा पहिला विद्यार्थी जोडा',
    'students.name': 'नाव',
    'students.phone': 'फोन',
    'students.email': 'ईमेल',
    'students.address': 'पत्ता',
    'students.startDate': 'सुरुवात तारीख',
    'students.lastPayment': 'शेवटचे पेमेंट',
    'students.edit': 'संपादित करा',
    'students.delete': 'हटवा',
    'students.save': 'जतन करा',
    'students.cancel': 'रद्द करा',
    
    // Punch Meal page
    'punch.title': 'जेवण पंच',
    'punch.subtitle': 'विद्यार्थ्यासाठी जेवण नोंदवा',
    'punch.selectStudent': 'विद्यार्थी निवडा',
    'punch.selectMeal': 'जेवण प्रकार निवडा',
    'punch.addons': 'अॅड-ऑन्स',
    'punch.notes': 'नोट्स (पर्यायी)',
    'punch.punchMeal': 'जेवण पंच करा',
    'punch.success': 'जेवण यशस्वीरित्या पंच केले',
    
    // Meal types
    'meal.mini': 'मिनी जेवण',
    'meal.full': 'पूर्ण जेवण',
    'meal.special': 'विशेष जेवण',
    
    // Billing page
    'billing.title': 'बिलिंग',
    'billing.subtitle': 'विद्यार्थ्यांसाठी बिले तयार करा',
    'billing.selectStudent': 'विद्यार्थी निवडा',
    'billing.selectMonth': 'महिना निवडा',
    'billing.summary': 'बिलिंग सारांश',
    'billing.totalMeals': 'एकूण जेवण',
    'billing.totalAmount': 'एकूण रक्कम',
    'billing.addonsTotal': 'अॅड-ऑन्स एकूण',
    'billing.generatePdf': 'PDF इनव्हॉइस तयार करा',
    'billing.noMeals': 'या कालावधीसाठी जेवण सापडले नाही',
    
    // Settings page
    'settings.title': 'सेटिंग्ज',
    'settings.subtitle': 'तुमच्या मेसचा तपशील आणि किंमत कॉन्फिगर करा',
    'settings.messDetails': 'मेस तपशील',
    'settings.messDetailsDesc': 'हे तपशील तुमच्या PDF इनव्हॉइसवर दिसतील',
    'settings.messName': 'मेसचे नाव',
    'settings.address': 'पत्ता',
    'settings.contact': 'संपर्क क्रमांक',
    'settings.upiId': 'UPI ID (पेमेंट QR साठी)',
    'settings.mealPricing': 'जेवण किंमत',
    'settings.mealPricingDesc': 'प्रत्येक जेवण प्रकारासाठी सानुकूल किंमत सेट करा',
    'settings.language': 'भाषा',
    'settings.languageDesc': 'तुमची पसंतीची भाषा निवडा',
    'settings.save': 'सेटिंग्ज जतन करा',
    'settings.reset': 'रीसेट',
    'settings.saved': 'सेटिंग्ज यशस्वीरित्या जतन केल्या',
    'settings.resetSuccess': 'सेटिंग्ज डीफॉल्टवर रीसेट झाल्या',
    
    // Common
    'common.loading': 'लोड होत आहे...',
    'common.error': 'एक त्रुटी आली',
    'common.confirm': 'पुष्टी करा',
    'common.cancel': 'रद्द करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादित करा',
    'common.save': 'जतन करा',
    'common.close': 'बंद करा',
    
    // Auth
    'auth.login': 'लॉगिन',
    'auth.signup': 'साइन अप',
    'auth.logout': 'लॉगआउट',
    'auth.email': 'ईमेल',
    'auth.password': 'पासवर्ड',
    'auth.loginSubtitle': 'तुमचा मेस व्यवस्थापित करण्यासाठी साइन इन करा',
    'auth.signupSubtitle': 'सुरू करण्यासाठी खाते तयार करा',
    'auth.noAccount': 'खाते नाही?',
    'auth.hasAccount': 'आधीच खाते आहे?',
    'auth.loginSuccess': 'यशस्वीरित्या लॉग इन केले',
    'auth.signupSuccess': 'खाते यशस्वीरित्या तयार केले',
    'auth.logoutSuccess': 'यशस्वीरित्या लॉग आउट केले',
    'auth.invalidCredentials': 'अवैध ईमेल किंवा पासवर्ड',
    'auth.alreadyRegistered': 'हा ईमेल आधीच नोंदणीकृत आहे',
    'auth.forgotPassword': 'पासवर्ड विसरलात?',
    'auth.resetPassword': 'पासवर्ड रीसेट करा',
    'auth.forgotSubtitle': 'रीसेट लिंक मिळवण्यासाठी तुमचा ईमेल टाका',
    'auth.resetSubtitle': 'तुमचा नवीन पासवर्ड टाका',
    'auth.sendResetLink': 'रीसेट लिंक पाठवा',
    'auth.updatePassword': 'पासवर्ड अपडेट करा',
    'auth.newPassword': 'नवीन पासवर्ड',
    'auth.resetEmailSent': 'पासवर्ड रीसेट ईमेल पाठवला! तुमचा इनबॉक्स तपासा.',
    'auth.passwordUpdated': 'पासवर्ड यशस्वीरित्या अपडेट केला',
    'auth.backToLogin': 'लॉगिन वर परत जा',
    
    // Settings
    'settings.account': 'खाते',
    'settings.accountDesc': 'तुमच्या खाते सेटिंग्ज व्यवस्थापित करा',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('appLanguage');
    return (stored as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
