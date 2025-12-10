// AI Assistant for Habits and Fitness - Content Filter and Response Generator
export const generateAIResponse = (userMessage, userContext = {}) => {
  const { completedCount = 0, streak = 0, habits = [] } = userContext;
  const message = userMessage.toLowerCase().trim();
  
  // Check if message is related to habits/fitness
  const fitnessKeywords = [
    'habit', 'fitness', 'exercise', 'workout', 'health', 'wellness', 'nutrition',
    'water', 'hydration', 'sleep', 'meditation', 'medicine', 'vitamin', 'steps',
    'walk', 'run', 'yoga', 'stretch', 'diet', 'food', 'energy', 'motivation',
    'goal', 'streak', 'routine', 'schedule', 'consistency', 'progress', 'weight',
    'cardio', 'strength', 'muscle', 'protein', 'calories', 'rest', 'recovery',
    'mindfulness', 'stress', 'anxiety', 'mood', 'focus', 'concentration'
  ];
  
  const isRelevant = fitnessKeywords.some(keyword => message.includes(keyword)) ||
                   message.includes('how') || message.includes('what') || message.includes('why') ||
                   message.includes('when') || message.includes('help') || message.includes('tip');
  
  if (!isRelevant) {
    const restrictedResponses = [
      "I'm your fitness and habits coach! I can only help with health, wellness, and habit-related questions. Ask me about workouts, nutrition, sleep, or building better habits! 💪",
      "Let's keep our conversation focused on your fitness journey! I'm here to help with habits, exercise, nutrition, and wellness topics. What would you like to know? 🏃‍♂️",
      "I specialize in fitness and habit coaching! Feel free to ask me about workouts, healthy routines, nutrition tips, or how to build lasting habits. 🌟",
      "My expertise is in fitness and wellness! I'd love to help you with exercise routines, healthy habits, nutrition advice, or motivation tips. What's on your mind? 🎯"
    ];
    return restrictedResponses[Math.floor(Math.random() * restrictedResponses.length)];
  }
  
  // Generate contextual responses based on user's current state and question
  if (message.includes('water') || message.includes('hydrat')) {
    const waterTips = [
      `Great question about hydration! ${completedCount >= 1 ? "I see you're staying on track today!" : "Start with a glass of water right now!"} Try drinking a glass when you wake up, before meals, and keep a bottle visible. Aim for 8 glasses daily! 💧`,
      "Hydration is key to energy and focus! Add lemon or cucumber for flavor, set hourly reminders, and drink a glass before each meal. Your body will thank you! 🍋",
      "Water is the foundation of all habits! Track your intake, use a marked bottle, and remember - if you feel thirsty, you're already dehydrated. Stay ahead of it! 💪",
      "Smart hydration strategy: Start each habit with water! Before exercise, meditation, or taking vitamins - it creates a powerful habit stack. 🌊"
    ];
    return waterTips[Math.floor(Math.random() * waterTips.length)];
  }
  
  if (message.includes('exercise') || message.includes('workout') || message.includes('steps')) {
    const exerciseTips = [
      `${streak > 0 ? `With your ${streak}-day streak, you're building amazing momentum!` : "Let's get you moving!"} Start with 10-minute walks, take stairs, park further away. Every step counts toward your 8000 daily goal! 👟`,
      "Movement is medicine! Try the 2-minute rule - commit to just 2 minutes of exercise. Often you'll do more, but 2 minutes builds the habit. Consistency beats intensity! 🏃‍♂️",
      "Exercise doesn't have to be gym time! Dance while cooking, do squats during TV commercials, walk during phone calls. Make it fun and it won't feel like work! 💃",
      "Build exercise habits by stacking them with existing routines. After coffee = 5-minute stretch. After lunch = short walk. Your body craves movement! 🤸‍♀️"
    ];
    return exerciseTips[Math.floor(Math.random() * exerciseTips.length)];
  }
  
  if (message.includes('sleep') || message.includes('rest') || message.includes('tired')) {
    const sleepTips = [
      "Sleep is when your body repairs and your habits solidify! Create a wind-down routine: dim lights 1 hour before bed, no screens 30 minutes before, keep your room cool (65-68°F). Quality sleep = better habit consistency! 😴",
      "Your sleep habit affects all others! Try the 3-2-1 rule: No food 3 hours before bed, no liquids 2 hours before, no screens 1 hour before. Your morning self will thank you! 🌙",
      "Sleep is not a luxury, it's a necessity! Aim for 7-9 hours, keep a consistent bedtime even on weekends, and make your bedroom a sanctuary - dark, quiet, and cool. 🛏️",
      "Poor sleep sabotages all your other habits! Create a bedtime ritual: herbal tea, gentle stretching, gratitude journaling. Your brain needs this signal to wind down. ✨"
    ];
    return sleepTips[Math.floor(Math.random() * sleepTips.length)];
  }
  
  if (message.includes('meditation') || message.includes('mindful') || message.includes('stress')) {
    const meditationTips = [
      "Meditation is like fitness for your mind! Start with just 2-3 minutes of deep breathing. Apps like Headspace or Calm are great, but even counting breaths works. Consistency matters more than duration! 🧘‍♀️",
      "Mindfulness can happen anywhere! Try mindful eating (chew slowly, taste your food), mindful walking (feel each step), or the 4-7-8 breathing technique. It's about being present! 🌸",
      "Stress is habit kryptonite! When overwhelmed, try the 5-4-3-2-1 technique: Notice 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Instant grounding! 🌿",
      "Meditation doesn't require sitting still! Try walking meditation, body scan while lying down, or mindful stretching. Find what works for your lifestyle and personality! 🚶‍♂️"
    ];
    return meditationTips[Math.floor(Math.random() * meditationTips.length)];
  }
  
  if (message.includes('motivation') || message.includes('give up') || message.includes('hard')) {
    const motivationTips = [
      `${completedCount > 0 ? `You've already completed ${completedCount} habits today - you're stronger than you think!` : "Every expert was once a beginner!"} Remember: You don't have to be perfect, just consistent. Progress over perfection! 🌟`,
      `${streak > 0 ? `Your ${streak}-day streak proves you can do this!` : "Today is day one of your comeback story!"} Habits aren't built in a day, but every day builds the habit. You're investing in future you! 💎`,
      "Motivation gets you started, but habit keeps you going! On tough days, lower the bar - do the minimum version. 1 push-up, 1 sip of water, 1 deep breath. Showing up is what matters! 🔥",
      "You're not behind, you're not failing - you're human! Every habit master has bad days. The difference? They restart tomorrow. Your consistency muscle gets stronger with each restart! 💪"
    ];
    return motivationTips[Math.floor(Math.random() * motivationTips.length)];
  }
  
  if (message.includes('nutrition') || message.includes('food') || message.includes('diet')) {
    const nutritionTips = [
      "Nutrition fuels your habits! Focus on whole foods: colorful vegetables, lean proteins, healthy fats. Meal prep on Sundays, keep healthy snacks visible, and remember - you can't out-exercise a bad diet! 🥗",
      "Small nutrition changes = big results! Add a vegetable to each meal, choose water over soda, eat protein with breakfast. Don't overhaul everything at once - build one food habit at a time! 🍎",
      "Your energy levels affect habit consistency! Eat balanced meals every 3-4 hours, include protein and fiber, limit processed foods. Stable blood sugar = stable motivation! ⚡",
      "Healthy eating is a habit too! Plan meals, prep ingredients, keep emergency healthy snacks ready. When you're hungry and unprepared, willpower fails. Preparation wins! 🥘"
    ];
    return nutritionTips[Math.floor(Math.random() * nutritionTips.length)];
  }
  
  if (message.includes('streak') || message.includes('consistency')) {
    const streakTips = [
      `${streak > 0 ? `Your ${streak}-day streak is impressive!` : "Ready to start a new streak?"} The secret to streaks: never miss twice. One bad day doesn't break you - two in a row starts a bad pattern. Get back on track tomorrow! 📈`,
      "Streaks are powerful because they create identity! You're not someone trying to be healthy - you ARE someone who takes care of their health. Each day reinforces this identity! 🎯",
      "Don't let perfect be the enemy of good! A 50% day is better than a 0% day. Drink 4 glasses instead of 8, walk 10 minutes instead of 30. Partial credit keeps streaks alive! ✨",
      "Streaks create momentum, but systems create lasting change! Focus on the process, not just the outcome. Celebrate small wins and trust the compound effect! 🚀"
    ];
    return streakTips[Math.floor(Math.random() * streakTips.length)];
  }
  
  if (message.includes('time') || message.includes('busy') || message.includes('schedule')) {
    const timeTips = [
      "No time? Try habit stacking! Drink water AFTER you start your coffee. Do squats WHILE brushing teeth. Meditate BEFORE checking your phone. Use existing habits as triggers! ⏰",
      "Busy people need micro-habits! 2-minute meditation, 5-minute walk, 30-second gratitude practice. Small habits compound into big changes. Start ridiculously small! 🐣",
      "Time is about priorities, not availability! Track your phone usage for a day - you might find 30 minutes of scrolling that could become 30 minutes of self-care! 📱",
      "The best time for habits is when you can be consistent! Morning person? Stack habits then. Night owl? Create an evening routine. Work with your natural rhythm! 🌅"
    ];
    return timeTips[Math.floor(Math.random() * timeTips.length)];
  }
  
  // General fitness and habit responses
  const generalResponses = [
    `${completedCount > 0 ? `You're doing great with ${completedCount} habits completed today!` : "Every journey starts with a single step!"} Remember: small consistent actions create extraordinary results. What specific area would you like to improve? 🌟`,
    `${streak > 0 ? `Your ${streak}-day streak shows real commitment!` : "Today is a perfect day to start building momentum!"} The key to lasting change is making habits so easy you can't say no. What's one tiny habit you could start today? 💪`,
    "Habits are the compound interest of self-improvement! 1% better each day = 37x better in a year. Focus on systems, not goals. What system can we build together? 📈",
    "Your future self is counting on the choices you make today! Every habit is a vote for the person you want to become. Health, energy, confidence - it all starts with daily actions! ✨"
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

// Quick responses for common questions
export const getQuickResponse = (type, context = {}) => {
  const responses = {
    greeting: [
      "Hello! I'm your personal fitness and habits coach! 💪 How can I help you build better habits today?",
      "Hey there, habit builder! 🌟 Ready to crush your fitness goals? What would you like to work on?",
      "Welcome back! 🎯 I'm here to help you with fitness, nutrition, and building lasting healthy habits!"
    ],
    encouragement: [
      "You're doing amazing! Every small step counts toward your bigger goals! 🚀",
      "Keep going! Consistency is your superpower, and you're building it every day! ⚡",
      "I believe in you! Your dedication to health and wellness is inspiring! 🌟"
    ]
  };
  
  return responses[type] ? responses[type][Math.floor(Math.random() * responses[type].length)] : null;
};