type UserData = {
    [key: string]: any;
  };
  
  type LoginInfo = {
    [key: string]: any;
  };
  
  export async function createUser(userData: any) {
    console.log("env", process.env.REACT_APP_API_BASE_URL)
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(userData),
      headers: { "content-type": "application/json" },
    });
    const data = await response.json();
    return { data };
  }
  
  export async function loginUser(loginInfo: LoginInfo): Promise<{ data: any }> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("auth", JSON.stringify(data));
        return { data };
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
  
  export async function signOut(): Promise<{ data: string }> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        body: "",
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        window.location.href = "/";
        return { data: "success" };
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
  
  export async function resetPasswordRequest(email: string): Promise<{ data: any }> {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password-request`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
          headers: { "content-type": "application/json" },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return { data };
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
  
  export async function resetPassword(data: UserData): Promise<{ data: any }> {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/reset-password/`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "content-type": "application/json" },
      });
      if (response.ok) {
        const result = await response.json();
        window.location.href = "/";
        return { data: result };
      } else {
        const error = await response.text();
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error as string);
    }
  }
  