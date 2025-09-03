export const mockPortfolios = {
    pagination: {
      page: 1,
      limit: 5,
      total: 9,
      totalPages: 2
    },
    data: [
      {
        portfolio_id: 115,
        user_id: 136,
        title: "Business Analyst Project",
        description: "Developed a comprehensive business analysis dashboard to track key performance indicators and provide actionable insights. Utilized advanced Excel functions and data visualization techniques.",
        status: "pending",
        video: null,
        supporting_document: null,
        created_at: "2025-08-17T09:39:40.000Z",
        portfolio_images: [{ id: 265, url: "https://placehold.co/600x400/EEE/31343C?text=Project+Image" }],
        portfolio_keywords: [{ id: 356, keyword: "front" }, { id: 357, keyword: "coding" }, { id: 358, keyword: "dashboard" }],
      },
      {
        portfolio_id: 116,
        user_id: 137,
        title: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform using the MERN stack. Features include user authentication, product catalog, shopping cart, and payment integration with Stripe.",
        status: "approved",
        video: null,
        supporting_document: null,
        created_at: "2025-08-16T15:45:10.000Z",
        portfolio_images: [{ id: 266, url: "https://placehold.co/600x400/EEE/31343C?text=E-commerce" }],
        portfolio_keywords: [{ id: 361, keyword: "react" }, { id: 362, keyword: "mongodb" }, { id: 363, keyword: "e-commerce" }],
      }
    ]
  };