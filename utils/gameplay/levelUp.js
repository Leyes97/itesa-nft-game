// La experiencia necesaria para pasar de nivel es 10 veces el nivel actual
export const experienceLimitPerLevel = (level) => 10 * level;

// Cada batalla ganada suma un punto de experiencia
export const experiencePerBattle = (experience) => experience++;

// Pasar de nivel cuando la experiencia actual supera el limite
export const levelUp = (experience, level) => {
  if (experience >= experienceLimitPerLevel(level)) {
    experience = 0;
    level++;
  }
  return { experience, level };
};
