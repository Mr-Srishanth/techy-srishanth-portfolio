- Create Admin Account

**What I'll do:**

1. Navigate to `/admin` login page
2. Toggle to "Create Admin Account" mode and also uses shortcut key of ctrl+s
3. Sign up with:
  - **Email:** [a.srishanth1733@gmail.com](mailto:a.srishanth1733@gmail.com)
  - **Password:** srishanth@portfolio
4. After account creation, **remove the public signup toggle** from the login page so no one else can register
5. Optionally lock down RLS policies to only allow your specific user ID to modify data

**Security hardening (included):**

- Remove the "First time? Create admin account" button from `AdminLogin.tsx`
- Keep only the sign-in form visible

***Files to modify:***

- `src/pages/AdminLogin.tsx` — remove signup UI and `handleSignUp` logic