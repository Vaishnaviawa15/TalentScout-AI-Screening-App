export function extractExperienceLevel(
  input: string
): "Fresher" | "Experienced" {
  const normalized = input.toLowerCase();

  const fresherKeywords = [
    "fresher",
    "recent graduate",
    "0 years",
    "no experience",
    "student",
    "entry level",
    "internship only",
  ];

  for (const keyword of fresherKeywords) {
    if (normalized.includes(keyword)) {
      return "Fresher";
    }
  }

  return "Experienced";
}
