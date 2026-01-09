/**
 * Utility functions for managing daily login streaks
 */

export function updateStreak(): { streak: number; isNewDay: boolean } {
  const storedUser = localStorage.getItem("finstinct-user");
  if (!storedUser) {
    return { streak: 0, isNewDay: false };
  }

  const user = JSON.parse(storedUser);
  const today = new Date().toDateString();
  const lastLoginDate = user.lastLoginDate || null;
  let streak = user.streak || 0;
  let isNewDay = false;

  // If no last login date, start streak at 1
  if (!lastLoginDate) {
    streak = 1;
    isNewDay = true;
  } else {
    const lastLogin = new Date(lastLoginDate);
    const daysDiff = Math.floor(
      (new Date().getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      // Same day, don't update streak
      isNewDay = false;
    } else if (daysDiff === 1) {
      // Consecutive day, increment streak
      streak += 1;
      isNewDay = true;
    } else {
      // Missed a day, reset streak
      streak = 1;
      isNewDay = true;
    }
  }

  // Update user data
  user.streak = streak;
  user.lastLoginDate = today;
  localStorage.setItem("finstinct-user", JSON.stringify(user));

  return { streak, isNewDay };
}

export function getStreak(): number {
  const storedUser = localStorage.getItem("finstinct-user");
  if (!storedUser) {
    return 0;
  }

  const user = JSON.parse(storedUser);
  return user.streak || 0;
}

