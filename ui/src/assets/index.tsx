export const gradientColors = [
  "linear-gradient(135deg, #ff7e5f, #feb47b)",
  "linear-gradient(135deg, #1cb5e0, #000046)",
  "linear-gradient(135deg, #ff5e62, #ffa66c)",
  "linear-gradient(135deg, #f43b47, #453a94)",
  "linear-gradient(135deg, #f12711, #f5af19)",
  "linear-gradient(135deg, #ff5252, #f7ff1e)",
  "linear-gradient(135deg, #0abfbc, #ff6b6b)",
  "linear-gradient(135deg, #314755, #26a0da)",
  "linear-gradient(135deg, #ff5f6d, #ffc371)",
  "linear-gradient(135deg, #ff4e50, #f9d423)",
];

// export const baseURL = "http://biddingclone.softprodigyphp.in/";
export const baseURL= 'http://localhost:5455'


export const Roles = {
  ForAll: "all",
  Invited: "invited",
  BidOnly: "bidOnly",
  Admin: "admin",
  AmitOnly: "amitOnly",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];