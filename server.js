const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors()); 
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// File upload configuration
const upload = multer({ 
    dest: 'uploads/',
    limits: {
        fileSize: 50 * 1024 * 1024,
    }
});

// Environment Variables
const GOOGLE_API_KEY = process.env.VITE_GOOGLE_AI_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;
const WATSONX_API_KEY = process.env.WATSONX_API_KEY;
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID;

// ============================================================================
// ADVANCED PLAGIARISM FIXER CLASS (FALLBACK)
// ============================================================================

class UltimatePlagiarismFixer {
    constructor() {
        this.synonymDatabase = this.buildSynonymDatabase();
        this.sentenceTemplates = this.buildSentenceTemplates();
        this.academicPhrases = this.buildAcademicPhrases();
    }

    buildSynonymDatabase() {
        return {
            "artificial": ["synthetic", "simulated", "computerized", "machine-driven"],
            "intelligence": ["cognition", "reasoning", "intellect", "brainpower"],
            "branch": ["field", "domain", "discipline", "specialty"],
            "computer": ["digital", "computing", "electronic", "automated"],
            "science": ["discipline", "field", "study", "domain"],
            "focuses": ["concentrates", "centers", "specializes", "emphasizes"],
            "creating": ["developing", "building", "designing", "constructing"],
            "machines": ["systems", "devices", "computers", "automata"],
            "capable": ["able", "competent", "proficient", "equipped"],
            "performing": ["executing", "carrying out", "accomplishing", "conducting"],
            "tasks": ["functions", "operations", "activities", "duties"],
            "normally": ["typically", "usually", "conventionally", "customarily"],
            "require": ["need", "demand", "necessitate", "call for"],
            "human": ["person", "individual", "cognitive", "mental"],
            "important": ["crucial", "vital", "paramount", "essential", "critical", "significant"],
            "increase": ["boost", "raise", "enhance", "amplify", "elevate", "escalate"],
            "decrease": ["reduce", "lower", "diminish", "lessen", "decline", "drop"],
            "explain": ["clarify", "elucidate", "expound", "delineate", "interpret"],
            "show": ["demonstrate", "reveal", "display", "exhibit", "illustrate", "manifest"],
            "cause": ["trigger", "precipitate", "provoke", "generate", "instigate"],
            "effect": ["outcome", "consequence", "result", "ramification", "impact"],
            "problem": ["issue", "challenge", "dilemma", "obstacle", "complication"],
            "solution": ["resolution", "remedy", "answer", "fix", "approach"],
            "study": ["research", "investigation", "analysis", "examination", "inquiry"],
            "find": ["discover", "uncover", "identify", "determine", "ascertain"],
            "people": ["individuals", "persons", "populace", "society", "community"],
            "good": ["beneficial", "advantageous", "favorable", "positive", "superior"],
            "bad": ["detrimental", "adverse", "negative", "unfavorable", "harmful"],
            "many": ["numerous", "multiple", "various", "myriad", "copious"],
            "big": ["substantial", "considerable", "significant", "extensive", "large-scale"]
        };
    }

    buildSentenceTemplates() {
        return [
            "While [original_point], it is evident that [new_perspective]",
            "Research conducted by scholars indicates that [concept] manifests as [alternative_view]",
            "From an analytical standpoint, [idea] can be interpreted through the lens of [framework]",
            "The prevailing evidence suggests that [concept] primarily influences [domain] by means of [mechanism]",
            "Contemporary understanding posits that [phenomenon] operates through [process] resulting in [outcome]"
        ];
    }

    buildAcademicPhrases() {
        return {
            starters: [
                "Current scholarly discourse reveals that",
                "Empirical evidence demonstrates that", 
                "Theoretical frameworks suggest that",
                "Methodological analysis indicates that",
                "Comprehensive research establishes that"
            ],
            connectors: [
                "furthermore", "consequently", "accordingly", "nevertheless", 
                "conversely", "similarly", "additionally", "subsequently"
            ]
        };
    }

    // Main fixing function
    async fixWithMaximumReduction(originalText) {
        console.log('🚀 Starting CUSTOM plagiarism reduction...');
        
        let currentText = originalText;
        const layers = [
            'replaceWithUncommonSynonyms',
            'restructureSentences', 
            'changeSentenceFocus',
            'modifyVerbPatterns',
            'applyAcademicStyle',
            'optimizeForPlagiarismCheck'
        ];
        
        for (const layer of layers) {
            console.log(`🔄 Applying ${layer}...`);
            currentText = await this[layer](currentText);
        }
        
        console.log('🎉 Custom plagiarism reduction completed!');
        return currentText + ' [Custom Fix]';
    }

    // Layer 1: Advanced synonym replacement
    replaceWithUncommonSynonyms(text) {
        const words = text.split(/\s+/);
        
        return words.map(word => {
            const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
            
            if (this.synonymDatabase[cleanWord] && Math.random() > 0.6) {
                const synonyms = this.synonymDatabase[cleanWord];
                const synonymIndex = Math.floor(Math.random() * (synonyms.length - 2)) + 2;
                const chosenSynonym = synonyms[synonymIndex] || synonyms[0];
                return this.preserveCapitalization(word, chosenSynonym);
            }
            
            return word;
        }).join(' ');
    }

    preserveCapitalization(original, replacement) {
        if (original[0] === original[0].toUpperCase()) {
            return replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        return replacement;
    }

    // Layer 2: Sentence restructuring
    restructureSentences(text) {
        const sentences = this.segmentSentences(text);
        
        return sentences.map(sentence => {
            const techniques = [
                () => this.convertActivePassive(sentence),
                () => this.addAcademicStarter(sentence),
                () => this.rearrangeClauses(sentence),
                () => this.changeSentenceLength(sentence)
            ];
            
            const randomTech = techniques[Math.floor(Math.random() * techniques.length)];
            return randomTech();
        }).join(' ');
    }

    // Layer 3: Change sentence focus
    changeSentenceFocus(sentence) {
        const patterns = [
            { from: /^(\w+) (is|are) (.+)$/i, to: "$3 characterizes $1" },
            { from: /^(\w+) (shows|demonstrates) that (.+)$/i, to: "The evidence from $1 indicates $3" },
            { from: /^Studies show that (.+)$/i, to: "Empirical research reveals $1" },
            { from: /^It is important to (.+)$/i, to: "Significant value lies in $1" }
        ];
        
        for (const pattern of patterns) {
            if (pattern.from.test(sentence)) {
                return sentence.replace(pattern.from, pattern.to);
            }
        }
        return sentence;
    }

    // Layer 4: Modify verb patterns
    modifyVerbPatterns(text) {
        const verbReplacements = {
            "is": ["represents", "constitutes", "embodies", "signifies"],
            "are": ["comprise", "represent", "constitute", "form"],
            "has": ["possesses", "contains", "incorporates", "exhibits"],
            "have": ["contain", "include", "embrace", "demonstrate"],
            "shows": ["demonstrates", "illustrates", "reveals", "indicates"],
            "proves": ["validates", "confirms", "substantiates", "corroborates"]
        };
        
        return text.split(/\s+/).map(word => {
            const cleanWord = word.toLowerCase();
            if (verbReplacements[cleanWord] && Math.random() > 0.7) {
                const replacements = verbReplacements[cleanWord];
                const replacement = replacements[Math.floor(Math.random() * replacements.length)];
                return this.preserveCapitalization(word, replacement);
            }
            return word;
        }).join(' ');
    }

    // Layer 5: Apply academic style
    applyAcademicStyle(text) {
        const sentences = this.segmentSentences(text);
        
        return sentences.map((sentence, index) => {
            if (index % 3 === 0 && this.academicPhrases.starters.length > 0) {
                const starter = this.academicPhrases.starters[
                    Math.floor(Math.random() * this.academicPhrases.starters.length)
                ];
                return `${starter} ${sentence.toLowerCase()}`;
            }
            return sentence;
        }).join(' ');
    }

    // Layer 6: Final optimization for plagiarism check
    optimizeForPlagiarismCheck(text) {
        const commonPhrases = [
            "it is important to",
            "in conclusion",
            "research has shown",
            "studies indicate",
            "it can be seen that"
        ];
        
        let optimized = text;
        commonPhrases.forEach(phrase => {
            const regex = new RegExp(phrase, 'gi');
            optimized = optimized.replace(regex, '');
        });
        
        return optimized.replace(/\s+/g, ' ').trim();
    }

    // Utility functions
    segmentSentences(text) {
        return text.split(/[.!?]+/).filter(s => s.trim().length > 5)
                  .map(s => s.trim() + '.');
    }

    convertActivePassive(sentence) {
        if (sentence.includes(' is ') || sentence.includes(' are ')) {
            return sentence;
        }
        
        const match = sentence.match(/^(\w+) (\w+)s? (.+)$/);
        if (match) {
            const [, subject, verb, object] = match;
            return `${object} is ${verb}ed by ${subject}`;
        }
        
        return sentence;
    }

    addAcademicStarter(sentence) {
        const starters = this.academicPhrases.starters;
        const randomStarter = starters[Math.floor(Math.random() * starters.length)];
        return `${randomStarter} ${sentence.toLowerCase()}`;
    }

    rearrangeClauses(sentence) {
        if (sentence.includes(',')) {
            const clauses = sentence.split(',');
            if (clauses.length > 1) {
                return [...clauses.slice(1), clauses[0]].join(', ');
            }
        }
        return sentence;
    }

    changeSentenceLength(sentence) {
        const words = sentence.split(' ');
        if (words.length > 15) {
            const midPoint = Math.floor(words.length / 2);
            return words.slice(0, midPoint).join(' ') + '. ' + 
                   words.slice(midPoint).join(' ') + '.';
        }
        return sentence;
    }
}

// ============================================================================
// WATSONX AI FUNCTIONS (PRIMARY)
// ============================================================================

// Get IBM Watsonx IAM Token
async function getWatsonxToken() {
    if (!WATSONX_API_KEY) throw new Error('Watsonx API key not configured.');
    try {
        const response = await axios({
            method: 'POST',
            url: 'https://iam.cloud.ibm.com/identity/token',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${WATSONX_API_KEY}`
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting Watsonx token:', error.message);
        throw new Error('IBM Authentication failed.');
    }
}

// Watsonx Text Fix Helper - PRIMARY AI
async function fixTextWithWatsonx(originalText) {
    console.log('🤖 Attempting Watsonx AI...');
    
    if (!WATSONX_API_KEY || !WATSONX_PROJECT_ID) {
        throw new Error('Watsonx API configuration missing');
    }

    try {
        const token = await getWatsonxToken();
        const WATSONX_URL = 'https://us-south.ml.cloud.ibm.com';
        
        console.log('🚀 Sending request to Watsonx...');
        const response = await axios({
            method: 'POST',
            url: `${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: {
                input: `Rephrase this text to make it original while keeping the same meaning: "${originalText}"`,
                model_id: 'ibm/granite-13b-chat-v2',
                project_id: WATSONX_PROJECT_ID,
                parameters: {
                    decoding_method: "greedy",
                    max_new_tokens: 200,
                    temperature: 0.7
                }
            },
            timeout: 30000
        });

        console.log('✅ Watsonx response received');
        
        const fixed = response.data.results?.[0]?.generated_text?.trim();
        
        if (!fixed) {
            throw new Error('No response from Watsonx AI');
        }

        console.log('🎉 Watsonx AI fix successful');
        return fixed + ' [Watsonx AI]';
        
    } catch (err) {
        console.error("❌ Watsonx AI failed:", err.message);
        throw err; // Re-throw to trigger fallback
    }
}

// ============================================================================
// HYBRID AI FIX FUNCTION - TRIES WATSONX FIRST, THEN CUSTOM FALLBACK
// ============================================================================

async function hybridAIFix(originalText) {
    console.log('\n🎯 STARTING HYBRID AI FIXING');
    
    // FIRST: Try Watsonx AI
    try {
        console.log('1️⃣ Attempting Watsonx AI...');
        const watsonxResult = await fixTextWithWatsonx(originalText);
        console.log('✅ Using Watsonx AI result');
        return {
            fixedText: watsonxResult,
            source: 'watsonx',
            success: true
        };
        
    } catch (watsonxError) {
        console.log('❌ Watsonx AI failed, falling back to custom functions...');
        
        // SECOND: Fallback to custom functions
        try {
            console.log('2️⃣ Using custom plagiarism fixer...');
            const customFixer = new UltimatePlagiarismFixer();
            const customResult = await customFixer.fixWithMaximumReduction(originalText);
            console.log('✅ Using custom function result');
            return {
                fixedText: customResult,
                source: 'custom',
                success: true
            };
            
        } catch (customError) {
            console.log('❌ Both methods failed, using basic fallback...');
            
            // THIRD: Ultimate fallback
            return {
                fixedText: `[Fallback] Try rephrasing: "${originalText}" by using synonyms and changing sentence structure.`,
                source: 'fallback',
                success: false
            };
        }
    }
}

// ============================================================================
// OTHER UTILITY FUNCTIONS
// ============================================================================

// PDF Utility
async function extractTextFromPdf(filePath) {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text || '';
}

// Google Search Function
async function searchGoogle(query) {
    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
        console.log(`❌ Missing API keys for: "${query.substring(0, 50)}..."`);
        return { error: 'Missing Google API key or CX' };
    }
    
    const url = 'https://www.googleapis.com/customsearch/v1';
    try {
        const res = await axios.get(url, {
            params: { key: GOOGLE_API_KEY, cx: GOOGLE_CX, q: query }
        });
        return res.data;
    } catch (err) {
        console.error("Google Search error:", err.message);
        return { error: 'Search service temporarily unavailable' };
    }
}

// Sentence Segmentation
function segmentSentences(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.map(s => s.trim() + '.');
}

// Plagiarism Check
async function performPlagiarismCheck(text) {
    console.log('\n🔍 Starting Plagiarism Check...');
    
    const processedText = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, ' ').trim();
    const allSentences = segmentSentences(processedText);
    
    console.log(`📝 Checking ${allSentences.length} sentences`);

    const checkPromises = allSentences.map(async (sentence, index) => {
        console.log(`\n${index + 1}/${allSentences.length}: Checking: "${sentence}"`);
        
        if (sentence.split(' ').length < 3) {
            console.log(`   ⏩ Skipped - too short`);
            return { chunk: sentence, isPlagiarized: false, sources: [] };
        }

        const query = `"${sentence}"`;
        console.log(`   🔍 Searching: ${query.substring(0, 60)}...`);
        
        const searchResult = await searchGoogle(query);
        const isPlagiarized = searchResult && searchResult.items && searchResult.items.length > 0;

        console.log(`   📊 Result: ${isPlagiarized ? 'PLAGIARIZED' : 'ORIGINAL'}`);

        let sources = [];
        if (isPlagiarized && searchResult.items) {
            sources = searchResult.items.slice(0, 2).map(item => ({
                title: item.title || 'Unknown Source',
                link: item.link || '#',
                snippet: item.snippet || 'No snippet available'
            }));
            console.log(`   🔗 Sources found: ${sources.length}`);
        }

        return { chunk: sentence, isPlagiarized, sources };
    });

    const checkedResults = await Promise.all(checkPromises);
    const matchedCount = checkedResults.filter(r => r.isPlagiarized).length;
    const score = allSentences.length > 0 ? Math.round((matchedCount / allSentences.length) * 100) : 0;

    console.log(`\n🎯 Plagiarism Score: ${score}% (${matchedCount}/${allSentences.length} sentences)`);
    return { score, results: checkedResults, totalSentences: allSentences.length };
}

// ============================================================================
// API ROUTES
// ============================================================================

const plagiarismFixer = new UltimatePlagiarismFixer();

// MAIN AI FIX ENDPOINT - HYBRID APPROACH
app.post('/api/fix-text', async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'No text provided to fix.' });

    try {
        console.log('\n🤖 HYBRID AI FIX REQUEST RECEIVED');
        console.log('Original text:', text);
        
        // Use the hybrid approach: Watsonx first, then custom fallback
        const result = await hybridAIFix(text);
        
        console.log('✅ Final AI fix completed');
        console.log('Source:', result.source);
        
        // Return consistent response format
        res.json({ 
            success: result.success,
            fixedText: result.fixedText,
            source: result.source
        });
        
    } catch (error) {
        console.error("❌ Hybrid AI fix error:", error);
        res.status(500).json({ 
            success: false,
            error: error.message,
            fixedText: `[Error] Try rephrasing manually: "${text}"`,
            source: 'error'
        });
    }
});

// Other existing routes remain the same...
app.post('/api/check-text', async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ error: 'No text provided' });

    try {
        console.log('\n📝 CHECK-TEXT REQUEST RECEIVED');
        const result = await performPlagiarismCheck(text);
        res.json(result);
    } catch (error) {
        console.error('❌ Plagiarism check error:', error);
        res.status(500).json({ error: 'An error occurred during the plagiarism check.' });
    }
});

app.post('/api/upload-pdf', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const filePath = req.file.path;

    try {
        console.log('\n📄 PDF UPLOAD REQUEST RECEIVED');
        const text = await extractTextFromPdf(filePath);
        console.log('PDF text extracted');
        fs.unlinkSync(filePath);
        const result = await performPlagiarismCheck(text);
        res.json(result);
    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.error('❌ PDF upload error:', err);
        res.status(500).json({ error: 'Failed to process PDF file' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));