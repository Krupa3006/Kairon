export function extractCvHighlights(cvText: string | null | undefined) {
  const value = cvText?.trim() ?? "";

  if (!value) {
    return [];
  }

  return value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 40)
    .slice(0, 3);
}

export function extractSkillTags(cvText: string | null | undefined) {
  const value = (cvText ?? "").toLowerCase();

  if (!value) {
    return [];
  }

  const skillLibrary = [
    "Product Strategy",
    "Operations",
    "Leadership",
    "SaaS",
    "Growth",
    "Stakeholder Management",
    "Go-to-Market",
    "Roadmapping",
    "Analytics",
    "Execution",
    "Program Management",
    "Fintech",
    "Platform",
    "AI",
    "Strategy",
  ];

  return skillLibrary.filter((skill) =>
    value.includes(skill.toLowerCase()),
  ).slice(0, 6);
}
