const OPENAI_API_KEY = 'your-openai-api-key'; // Replace with your API key

export const generateMotivationalMessage = async (completedCount, streak) => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `Generate a short, encouraging message for someone who completed ${completedCount}/5 daily habits today and has a ${streak}-day streak. Keep it under 30 words and make it personal and motivating.`
        }],
        max_tokens: 50
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI message:', error);
    return getDefaultMessage(completedCount, streak);
  }
};

const getDefaultMessage = (completedCount, streak) => {
  if (completedCount === 5) return `Amazing! 🎉 ${streak} days strong! Your pet is thriving!`;
  if (completedCount >= 3) return `Great progress! ${completedCount}/5 habits done. Keep going! 💪`;
  if (completedCount >= 1) return `Good start! ${completedCount}/5 habits completed. Your pet believes in you! 🌟`;
  return `New day, fresh start! Your pet is waiting for you to shine! ✨`;
};