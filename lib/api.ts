const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type UserProfile = {
  id: string;
  name: string;
  role: string; // character
  xp: number;
  leaderboard_position?: number;
};

export type AuthResponse = {
  user: {
    id: string;
    email: string;
  };
  session: {
    access_token: string;
    refresh_token: string;
  };
};

// Sign up a new user
export async function signup(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Signup failed");
  }

  const data = await response.json();
  
  // If signup response includes session, return it directly
  if (data.session) {
    return {
      user: data.user,
      session: data.session,
    };
  }
  
  // Otherwise, login to get session (for email confirmation flows)
  const loginResponse = await login(email, password);
  return loginResponse;
}

// Login user
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Login failed");
  }

  return await response.json();
}

// Create user profile
export async function createProfile(
  user_id: string,
  name: string,
  role: string,
  accessToken: string
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ user_id, name, role }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to create profile");
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] : data;
}

// Get user profile
export async function getProfile(
  user_id: string,
  accessToken: string
): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/profile/${user_id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch profile");
  }

  return await response.json();
}

// Add XP to user profile
export async function addXP(
  user_id: string,
  xp: number,
  accessToken: string
): Promise<{ xp: number }> {
  const response = await fetch(`${API_BASE_URL}/profile/xp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ user_id, xp }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to add XP");
  }

  return await response.json();
}

// Get leaderboard
export async function getLeaderboard(): Promise<
  Array<{ name: string; xp: number; leaderboard_position: number }>
> {
  const response = await fetch(`${API_BASE_URL}/leaderboard`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to fetch leaderboard");
  }

  return await response.json();
}

