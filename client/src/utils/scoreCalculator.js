const LEVEL_SCORE = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100,
}

export function levelToScore(level) {
  return LEVEL_SCORE[level] ?? 0
}

export function computeGap(currentLevel, requiredLevel) {
  return Math.max(0, levelToScore(requiredLevel) - levelToScore(currentLevel))
}

export function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

export function matchFromBreakdown(breakdown = {}) {
  const weights = {
    skillOverlap: 0.45,
    verification: 0.2,
    assessments: 0.2,
    projects: 0.15,
  }
  const score = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (Number(breakdown[key] ?? 0) * weight)
  }, 0)
  return clampScore(score)
}
