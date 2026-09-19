import Memory from "../models/memory.model.js";

// Common stop words to exclude during keyword matching
const STOP_WORDS = new Set([
    "a", "an", "the", "is", "are", "was", "were", "am", "be", "been",
    "do", "does", "did", "have", "has", "had",
    "i", "me", "my", "myself", "you", "your", "we", "our", "he", "she", "it", "they",
    "what", "which", "who", "whom", "where", "when", "why", "how",
    "that", "this", "these", "those", "there",
    "and", "or", "but", "if", "because", "as", "until", "while",
    "of", "at", "by", "for", "with", "about", "against", "between", "into", "through",
    "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under",
    "again", "further", "then", "once", "here",
    "all", "any", "both", "each", "few", "more", "most", "other", "some", "such",
    "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very",
    "s", "t", "can", "will", "just", "don", "should", "now", "tell", "know", "please", "remember"
]);

const FIRST_PERSON_TOKENS = new Set(["i", "my", "me", "mine", "myself"]);

// Sensitive data pattern detection
const SENSITIVE_PATTERN = /(?:^|_|\b)(password|passwd|api[_\s-]?key|secret(?:[_\s-]?key)?|auth[_\s-]?token|access[_\s-]?token|token|jwt|bearer[_\s-]?token|credit[_\s-]?card|cvv|private[_\s-]?key|pin|ssn|credentials?)(?:_|\b|$)/i;

/**
 * Check if text contains sensitive security credentials
 */
export const isSensitiveInfo = (text) => {
    if (!text || typeof text !== "string") return false;
    return SENSITIVE_PATTERN.test(text);
};

/**
 * Format a stored memory key into a human-readable label
 * e.g. "dsa_language" -> "DSA Language", "favorite_editor" -> "Favorite Editor"
 */
export const formatMemoryLabel = (key) => {
    if (!key) return "";
    return key
        .split("_")
        .map((w) => (w.toUpperCase() === "DSA" ? "DSA" : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join(" ");
};

/**
 * Normalize memory keys consistently:
 * e.g. "DSA Language" -> "dsa_language", "favorite editor" -> "favorite_editor"
 */
export const normalizeMemoryKey = (key) => {
    if (!key) return "";
    return key
        .trim()
        .replace(/([a-z])([A-Z])/g, "$1_$2")
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_+|_+$/g, "");
};

/**
 * Get all memories for a user
 */
export const getUserMemories = async (userId) => {
    try {
        const memories = await Memory.find({ userId }).sort({ createdAt: -1 });
        return memories;
    } catch (error) {
        console.error("Get user memories error:", error);
        return [];
    }
};

/**
 * Format memories before sending them to AI
 */
export const formatMemoriesForAI = (memories) => {
    if (!memories || memories.length === 0) {
        return "No relevant saved memories about the user.";
    }

    return memories
        .map((memory) => `${memory.key}: ${memory.value}`)
        .join("\n");
};

/**
 * Get memories relevant to the current user message
 */
export const getRelevantMemories = (memories, message) => {
    if (!memories || memories.length === 0) return [];
    if (!message || !message.trim()) return [];

    const raw = message.toLowerCase().trim();
    const msgWords = raw
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

    const hasFirstPerson = msgWords.some((w) => FIRST_PERSON_TOKENS.has(w));
    const meaningfulMsgWords = msgWords.filter((w) => !STOP_WORDS.has(w) && w.length > 1);

    return memories.filter((memory) => {
        const key = (memory.key || "").toLowerCase();
        const value = (memory.value || "").toLowerCase();

        // 1. Direct match with full key phrase
        const keyPhrase = key.replace(/_/g, " ");
        if (raw.includes(keyPhrase) || raw.includes(key)) {
            return true;
        }

        // 2. Value match (only if message contains a first-person reference or a key keyword)
        if (value.length >= 2 && raw.includes(value)) {
            const keyWords = key.split("_");
            const hasKeyWord = keyWords.some((kw) => meaningfulMsgWords.includes(kw));
            if (hasFirstPerson || hasKeyWord) {
                return true;
            }
        }

        // 3. Keyword matching on memory key parts
        const keyParts = key.split("_").filter((p) => !STOP_WORDS.has(p) && p.length > 1);
        if (keyParts.length === 0) return false;

        const matchedKeyParts = keyParts.filter((part) => {
            if (meaningfulMsgWords.includes(part)) return true;
            return meaningfulMsgWords.some((mw) => mw.startsWith(part) || part.startsWith(mw));
        });

        // If key has 1 part (e.g. "editor"), 1 match is sufficient
        if (keyParts.length === 1 && matchedKeyParts.length >= 1) {
            return true;
        }

        // If at least 2 parts match (e.g. "favorite" and "editor")
        if (matchedKeyParts.length >= 2) {
            return true;
        }

        // Domain-specific anchors (e.g. "dsa" in "dsa_language", "editor" in "favorite_editor", "project" in "project_name")
        if (keyParts.includes("dsa") && matchedKeyParts.includes("dsa")) return true;
        if (keyParts.includes("editor") && matchedKeyParts.includes("editor")) return true;
        if (keyParts.includes("project") && matchedKeyParts.includes("project")) return true;

        return false;
    });
};

/**
 * Detect explicit memory commands:
 * SAVE_MEMORY, DELETE_MEMORY, LIST_MEMORIES, SENSITIVE_REJECT
 */
export const detectMemoryCommand = (message, userMemories = []) => {
    if (!message || typeof message !== "string") {
        return { isMemoryCommand: false };
    }

    const text = message.trim();
    const lower = text.toLowerCase().replace(/[?!.,]+$/, "").trim();

    // 1. Sensitive Data Check
    if (
        /\b(remember|save|store|keep)\b.*\b(password|passwd|api[_\s-]?key|secret|token|pin|credit\s*card|credentials?|jwt)\b/i.test(text) ||
        /\b(my\s+password|my\s+api[_\s-]?key|my\s+secret|my\s+pin|my\s+token|my\s+credentials?|my\s+jwt)\s+(?:is|are)\b/i.test(text)
    ) {
        return {
            isMemoryCommand: true,
            action: "SENSITIVE_REJECT",
            reply: "⚠️ For your security, I cannot store passwords, API keys, tokens, or sensitive credentials in memory.",
        };
    }

    // 2. LIST_MEMORIES
    const listPatterns = [
        /^what do you remember(?: about me)?$/i,
        /^what do you know about me$/i,
        /^what have you remembered(?: about me)?$/i,
        /^what do you recall(?: about me)?$/i,
        /^(?:show|list|view|display) (?:all |my )?memories$/i,
        /^tell me what you remember(?: about me)?$/i,
        /^do you remember anything(?: about me)?$/i,
        /^what(?:'s| is) in my memory(?: vault)?$/i,
        /^what memories do you have(?: about me)?$/i,
    ];

    if (listPatterns.some((p) => p.test(lower))) {
        return {
            isMemoryCommand: true,
            action: "LIST_MEMORIES",
        };
    }

    // 3. DELETE_MEMORY
    const deletePrefixMatch = lower.match(
        /^(?:please\s+)?(?:forget|delete|remove|clear)(?:\s+that|\s+about|\s+my)?\s+(.+)$/i
    );

    if (deletePrefixMatch) {
        let rawTarget = deletePrefixMatch[1]
            .replace(/^(?:my\s+)/i, "")
            .replace(/\s+(?:preference|memory)$/i, "")
            .trim();

        // Check for "that I use Java for DSA" -> "dsa"
        const useMatch = rawTarget.match(
            /^(?:that\s+)?i\s+(?:use|code in|program in)\s+([a-z0-9#+.\s]+?)(?:\s+for\s+([a-z0-9\s]+))?$/i
        );
        if (useMatch) {
            rawTarget = useMatch[2] ? `${useMatch[2]} language` : useMatch[1];
        }

        const normalizedTarget = normalizeMemoryKey(rawTarget);
        const targetWords = rawTarget.toLowerCase().split(/\s+/).filter((w) => w.length > 1);

        // Search user memories
        const matches = userMemories.filter((m) => {
            const k = m.key.toLowerCase();
            const v = m.value.toLowerCase();

            if (k === normalizedTarget || k === rawTarget.toLowerCase()) return true;
            if (v === rawTarget.toLowerCase()) return true;
            if (k.includes(normalizedTarget) || normalizedTarget.includes(k)) return true;

            const kWords = k.split("_");
            const matchesWord = targetWords.some((tw) => kWords.includes(tw) || v.toLowerCase().includes(tw));
            return matchesWord;
        });

        if (matches.length === 0) {
            return {
                isMemoryCommand: true,
                action: "DELETE_NOT_FOUND",
                target: rawTarget,
            };
        }

        if (matches.length === 1) {
            return {
                isMemoryCommand: true,
                action: "DELETE_MEMORY",
                memory: matches[0],
                target: rawTarget,
            };
        }

        // Check if one is an exact key match
        const exactMatch = matches.find(
            (m) => m.key === normalizedTarget || m.key === `favorite_${normalizedTarget}`
        );
        if (exactMatch) {
            return {
                isMemoryCommand: true,
                action: "DELETE_MEMORY",
                memory: exactMatch,
                target: rawTarget,
            };
        }

        // Ambiguous delete
        return {
            isMemoryCommand: true,
            action: "AMBIGUOUS_DELETE",
            target: rawTarget,
            candidates: matches,
        };
    }

    // 4. SAVE_MEMORY (Deterministic rules)
    // Rule 1: "Remember that I use Java for DSA" / "Remember I use Python for DSA"
    const dsaMatch = text.match(
        /(?:please\s+)?(?:remember|don't forget|dont forget|keep in mind)(?:\s+that)?\s+i\s+(?:use|code in|program in|prefer)\s+([a-zA-Z0-9#+.]+?)\s+for\s+([a-zA-Z0-9\s]+?)[.!]?$/i
    );
    if (dsaMatch) {
        const lang = dsaMatch[1].trim();
        const subject = dsaMatch[2].trim();
        const key = `${normalizeMemoryKey(subject)}_language`;
        return {
            isMemoryCommand: true,
            action: "SAVE_MEMORY",
            key,
            value: lang,
            description: `you use ${lang} for ${subject.toUpperCase()}`,
        };
    }

    // Rule 2: "Remember that my favorite editor is VS Code" / "My favorite editor is VS Code"
    const favMatch = text.match(
        /(?:(?:please\s+)?(?:remember|don't forget|dont forget|keep in mind)(?:\s+that)?\s+)?my\s+favorite\s+([a-zA-Z0-9\s]+?)\s+is\s+([^.!?]+)[.!]?$/i
    );
    if (favMatch) {
        const item = favMatch[1].trim();
        const val = favMatch[2].trim();
        const key = `favorite_${normalizeMemoryKey(item)}`;
        return {
            isMemoryCommand: true,
            action: "SAVE_MEMORY",
            key,
            value: val,
            description: `your favorite ${item} is ${val}`,
        };
    }

    // Rule 3: "Remember that my project is called Jarvis" / "Remember my project is named Jarvis"
    const projMatch = text.match(
        /(?:(?:please\s+)?(?:remember|don't forget|dont forget|keep in mind)(?:\s+that)?\s+)?my\s+([a-zA-Z0-9\s]+?)\s+(?:is called|is named)\s+([^.!?]+)[.!]?$/i
    );
    if (projMatch) {
        const item = projMatch[1].trim();
        const val = projMatch[2].trim();
        const key = `${normalizeMemoryKey(item)}_name`;
        return {
            isMemoryCommand: true,
            action: "SAVE_MEMORY",
            key,
            value: val,
            description: `your ${item} is ${val}`,
        };
    }

    // Rule 4: "Please remember I prefer VS Code" / "Remember that I prefer dark mode"
    const preferMatch = text.match(
        /(?:please\s+)?(?:remember|don't forget|dont forget|keep in mind)(?:\s+that)?\s+i\s+prefer\s+([^.!?]+)[.!]?$/i
    );
    if (preferMatch) {
        const val = preferMatch[1].trim();
        let key = "preferred_choice";
        if (/dark|light|theme/i.test(val)) key = "theme_preference";
        else if (/vs code|vim|neovim|sublime|intellij/i.test(val)) key = "favorite_editor";
        else if (/python|java|javascript|typescript|c\+\+|rust/i.test(val)) key = "preferred_language";
        return {
            isMemoryCommand: true,
            action: "SAVE_MEMORY",
            key,
            value: val,
            description: `you prefer ${val}`,
        };
    }

    // Rule 5: "Don't forget that I am preparing for placements" / "Remember that I am preparing for placements"
    const goalMatch = text.match(
        /(?:(?:please\s+)?(?:remember|don't forget|dont forget|keep in mind)(?:\s+that)?\s+)?i\s+am\s+(?:currently\s+)?(preparing for [^.!?]+|learning [^.!?]+|working on [^.!?]+)[.!]?$/i
    );
    if (goalMatch) {
        const val = goalMatch[1].trim();
        return {
            isMemoryCommand: true,
            action: "SAVE_MEMORY",
            key: "current_goal",
            value: val,
            description: `you are ${val}`,
        };
    }

    // General explicit "Remember that ..." -> fallback to extraction
    if (/^(?:please\s+)?(?:remember that|remember|don't forget that|dont forget that|keep in mind that)\s+/i.test(text)) {
        return {
            isMemoryCommand: true,
            action: "SAVE_MEMORY_AI_FALLBACK",
        };
    }

    return { isMemoryCommand: false };
};