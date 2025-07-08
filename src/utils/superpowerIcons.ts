
import {
  Brain, Crown, Users, Handshake, Lightbulb, Target, Zap, Shield,
  Heart, Compass, Rocket, Star, Award, Eye, Megaphone, Puzzle,
  Globe, Clock, TrendingUp, CheckCircle, Wrench, Palette, Book,
  Music, Mountain, Coffee, Smile, Diamond, Flame, Gem
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Predefined stock of 30 unique icons mapped to keywords/themes
export const ICON_KEYWORD_MAP: Record<string, LucideIcon> = {
  // Leadership & Management
  "leadership": Crown,
  "management": Users,
  "strategy": Compass,
  "vision": Eye,
  "execution": Target,

  // Collaboration & Communication
  "collaboration": Handshake,
  "communication": Megaphone,
  "teamwork": Users,
  "networking": Globe,
  "relationship": Heart,

  // Innovation & Creativity
  "innovation": Lightbulb,
  "creativity": Palette,
  "design": Palette,
  "thinking": Brain,
  "ideation": Lightbulb,

  // Problem Solving & Analysis
  "problem": Puzzle,
  "solving": Wrench,
  "analysis": Brain,
  "critical": Eye,
  "research": Book,

  // Performance & Results
  "performance": TrendingUp,
  "results": Award,
  "achievement": CheckCircle,
  "excellence": Diamond,
  "quality": Star,

  // Energy & Drive
  "energy": Zap,
  "passion": Flame,
  "drive": Rocket,
  "motivation": Mountain,
  "enthusiasm": Smile,

  // Skills & Expertise
  "technical": Wrench,
  "expertise": Gem,
  "knowledge": Book,
  "learning": Book,
  "adaptability": Clock,

  // Support & Service
  "support": Shield,
  "service": Heart,
  "mentoring": Users,
  "coaching": Compass,
  "empathy": Heart,

  // Special traits
  "resilience": Shield,
  "focus": Target,
  "balance": Coffee,
  "harmony": Music,
  "growth": TrendingUp
}

// Semantic similarity mapping for better matching
const SEMANTIC_GROUPS: Record<string, string[]> = {
  "leadership": ["lead", "manage", "direct", "guide", "captain", "head"],
  "collaboration": ["team", "partner", "cooperate", "work", "together", "unite"],
  "innovation": ["create", "invent", "new", "original", "fresh", "novel"],
  "problem": ["solve", "fix", "resolve", "troubleshoot", "debug", "repair"],
  "communication": ["speak", "present", "explain", "articulate", "express", "convey"],
  "analysis": ["analyze", "examine", "study", "investigate", "evaluate", "assess"],
  "performance": ["achieve", "deliver", "execute", "accomplish", "succeed", "excel"],
  "creativity": ["artistic", "imaginative", "inventive", "creative", "inspired"],
  "technical": ["tech", "engineering", "coding", "development", "systems"],
  "energy": ["dynamic", "vibrant", "active", "powerful", "strong", "intense"]
}

export function getSuperpowerIcons(superpowers: Array<{ title: string; description: string }>): Array<{ title: string; description: string; icon: LucideIcon }> {
  const usedIcons = new Set<LucideIcon>()
  const results: Array<{ title: string; description: string; icon: LucideIcon }> = []

  for (const superpower of superpowers) {
    const icon = selectBestIcon(superpower.title, superpower.description, usedIcons)
    usedIcons.add(icon)
    results.push({
      ...superpower,
      icon
    })
  }

  return results
}

function selectBestIcon(title: string, description: string, usedIcons: Set<LucideIcon>): LucideIcon {
  const text = `${title} ${description}`.toLowerCase()
  
  // Step 1: Try exact keyword matches
  for (const [keyword, icon] of Object.entries(ICON_KEYWORD_MAP)) {
    if (!usedIcons.has(icon) && text.includes(keyword)) {
      return icon
    }
  }

  // Step 2: Try semantic similarity matches
  for (const [primaryKeyword, variants] of Object.entries(SEMANTIC_GROUPS)) {
    const primaryIcon = ICON_KEYWORD_MAP[primaryKeyword]
    if (!primaryIcon || usedIcons.has(primaryIcon)) continue

    for (const variant of variants) {
      if (text.includes(variant)) {
        return primaryIcon
      }
    }
  }

  // Step 3: Try partial matches on main keywords
  for (const [keyword, icon] of Object.entries(ICON_KEYWORD_MAP)) {
    if (!usedIcons.has(icon)) {
      // Check if any word in the text contains the keyword
      const words = text.split(/\s+/)
      for (const word of words) {
        if (word.includes(keyword) || keyword.includes(word)) {
          return icon
        }
      }
    }
  }

  // Step 4: Find any unused icon from our stock
  for (const icon of Object.values(ICON_KEYWORD_MAP)) {
    if (!usedIcons.has(icon)) {
      return icon
    }
  }

  // Step 5: Fallback to Star icon (should rarely happen with 30 icons and max 3 superpowers)
  return Star
}
