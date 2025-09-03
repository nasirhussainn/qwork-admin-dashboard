export const mockUsers = {
    page: 1,
    limit: 5,
    total: 14,
    totalPages: 3,
    users: [
      {
        id: 136,
        email: "fatima.s@example.com",
        is_premium: 0,
        is_active: 1,
        status: "pending",
        created_at: "2025-08-17T09:13:17.000Z",
        profile: {
          id: 72,
          user_id: 136,
          profile_image: "https://i.pravatar.cc/150?img=1",
          first_name: "Fatima",
          last_name: "Shafiee",
          date_of_birth: "1998-08-01",
          address: "Lahore",
          city: "Lahore",
          state: "Pakistan",
          years_of_experience: "0-1 years",
          availability: "Remote",
          professional_headshot: "I am a dedicated professional with a passion for back-end development.",
          professional_summary: "Skilled in creating robust and scalable server-side applications."
        },
        interests: {
          categories: [{ id: 121, name: "Teacher" }, { id: 115, name: "Back-end Development" }, { id: 139, name: "Customer Support" }],
          keywords: [{ id: 207, name: "MS word, excel, front, dashboard, learning" }]
        },
      },
      {
        id: 137,
        email: "john.d@example.com",
        is_premium: 1,
        is_active: 1,
        status: "approved",
        created_at: "2025-08-16T11:20:05.000Z",
        profile: {
          id: 73,
          user_id: 137,
          profile_image: "https://i.pravatar.cc/150?img=2",
          first_name: "John",
          last_name: "Doe",
          date_of_birth: "1995-05-20",
          address: "Karachi",
          city: "Karachi",
          state: "Pakistan",
          years_of_experience: "5+ years",
          availability: "Full-time",
          professional_headshot: "Experienced full-stack developer.",
          professional_summary: "Expert in React and Node.js ecosystems."
        },
        interests: {
          categories: [{ id: 110, name: "Full-stack Development" }, { id: 112, name: "DevOps" }],
          keywords: [{ id: 208, name: "React, Node, AWS, Docker" }]
        },
      }
    ],
  };