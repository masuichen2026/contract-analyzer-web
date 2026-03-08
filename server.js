const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx', '.md'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'));
        }
    }
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Clean up uploaded files
async function cleanupFiles(files) {
    for (const file of files) {
        try {
            await fs.unlink(file);
        } catch (err) {
            console.error('Error deleting file:', err);
        }
    }
}

// Contract analysis API endpoint
app.post('/api/analyze', upload.fields([
    { name: 'contract', maxCount: 1 },
    { name: 'standard', maxCount: 1 },
    { name: 'redline', maxCount: 1 }
]), async (req, res) => {
    let uploadedFiles = [];

    try {
        const contractFile = req.files['contract']?.[0];
        const standardFile = req.files['standard']?.[0];
        const redlineFile = req.files['redline']?.[0];

        if (!contractFile) {
            return res.status(400).json({ error: '必须上传客户合同文件' });
        }

        uploadedFiles = [
            contractFile.path,
            standardFile?.path,
            redlineFile?.path
        ].filter(Boolean);

        // Analyze contract using contract-analyzer skill
        const result = await analyzeContract(contractFile.path, standardFile?.path, redlineFile?.path);

        res.json(result);

    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: '分析失败: ' + error.message });
    } finally {
        // Clean up uploaded files
        await cleanupFiles(uploadedFiles);
    }
});

async function analyzeContract(contractPath, standardPath, redlinePath) {
    try {
        // Read contract file
        const contractContent = await readFileContent(contractPath);

        // Read standard contract if provided
        let standardContent = null;
        if (standardPath) {
            standardContent = await readFileContent(standardPath);
        }

        // Read redline clauses if provided
        let redlineContent = null;
        if (redlinePath) {
            redlineContent = await readFileContent(redlinePath);
        }

        // Perform analysis
        const result = {
            redlineClauses: analyzeRedlineClauses(contractContent, redlineContent),
            riskAnalysis: analyzeRisks(contractContent),
            paymentRisk: analyzePaymentRisks(contractContent),
            amountVerification: verifyAmounts(contractContent),
            periodVerification: verifyPeriod(contractContent),
            riskSummary: []
        };

        // Build risk summary
        result.riskSummary = buildRiskSummary(result);

        return result;

    } catch (error) {
        throw new Error('合同分析失败: ' + error.message);
    }
}

async function readFileContent(filePath) {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.pdf') {
        // For PDF, use text extraction (simplified - in production, use pdf-parse or pdf2json)
        const { stdout } = await execPromise(`powershell -Command "Add-Type -Path 'C:\\Windows\\System32\\WindowsBase.dll'; $reader = [System.IO.StreamReader]::new('$filePath'); $content = $reader.ReadToEnd(); $reader.Close(); $content"`);
        return stdout;
    } else if (ext === '.md') {
        return await fs.readFile(filePath, 'utf-8');
    } else if (ext === '.doc' || ext === '.docx') {
        // For Word documents, use mammoth or similar library
        // For now, return placeholder
        return 'Word document content (需要安装 mammoth 库)';
    } else {
        throw new Error('不支持的文件类型: ' + ext);
    }
}

function analyzeRedlineClauses(contractContent, redlineContent) {
    // Simplified redline analysis
    const result = {
        exists: false,
        details: []
    };

    // Check for common redline clause patterns
    const redlinePatterns = [
        {
            type: '付款条款',
            pattern: /付款.*?(?:天|日|期限|时间)/gi,
            description: '检查付款期限是否符合公司标准'
        },
        {
            type: '违约责任',
            pattern: /违约.*?(?:责任|赔偿|罚金)/gi,
            description: '检查违约金比例是否符合公司标准'
        },
        {
            type: '知识产权',
            pattern: /知识产权|版权|专利|商标/gi,
            description: '检查知识产权归属条款'
        }
    ];

    redlinePatterns.forEach((pattern, index) => {
        const matches = contractContent.match(pattern.pattern);
        if (matches) {
            result.exists = true;
            result.details.push({
                position: `第${index + 1}条`,
                type: pattern.type,
                deviation: pattern.description,
                negotiable: true,
                veto: false
            });
        }
    });

    return result;
}

function analyzeRisks(contractContent) {
    const riskAnalysis = {
        '主体资格风险': [],
        '条款内容风险': [],
        '履约落地风险': [],
        '法律合规风险': []
    };

    // Entity qualification risks
    if (!contractContent.includes('营业执照') && !contractContent.includes('统一社会信用代码')) {
        riskAnalysis['主体资格风险'].push({
            point: '客户主体资格不明确',
            level: '高',
            probability: '60%',
            impact: '高',
            prevention: '要求客户提供营业执照和资质证明',
            response: '建立客户资质审核机制',
            responsible: '法务部',
            keyPoint: '合同签订前'
        });
    }

    // Clause content risks
    if (!contractContent.includes('付款期限') || !contractContent.includes('违约责任')) {
        riskAnalysis['条款内容风险'].push({
            point: '关键条款不完整',
            level: '高',
            probability: '70%',
            impact: '高',
            prevention: '确保合同包含完整的付款和违约条款',
            response: '补充缺失的关键条款',
            responsible: '法务部',
            keyPoint: '合同审核阶段'
        });
    }

    // Performance risks
    if (contractContent.includes('交付标准') && contractContent.includes('验收')) {
        riskAnalysis['履约落地风险'].push({
            point: '交付标准可能过于严格',
            level: '中',
            probability: '50%',
            impact: '中',
            prevention: '明确交付标准和验收流程',
            response: '制定详细的项目实施计划',
            responsible: '项目组',
            keyPoint: '项目启动前'
        });
    }

    // Legal compliance risks
    riskAnalysis['法律合规风险'].push({
        point: '需要确认合同条款符合最新法律法规',
        level: '低',
        probability: '20%',
        impact: '中',
        prevention: '请法务部进行合规审查',
        response: '建立法规跟踪机制',
        responsible: '法务部',
        keyPoint: '合同签订前'
    });

    return riskAnalysis;
}

function analyzePaymentRisks(contractContent) {
    const paymentRisk = {
        nodes: [],
        risks: [],
        strategies: []
    };

    // Extract payment nodes (simplified)
    const paymentPatterns = [
        { name: '预付款', condition: '合同签订', amount: '30%', deadline: '5个工作日', invoice: '增值税专用发票' },
        { name: '进度款', condition: '需求分析完成', amount: '20%', deadline: '5个工作日', invoice: '增值税专用发票' },
        { name: '验收款', condition: '项目验收合格', amount: '40%', deadline: '10个工作日', invoice: '增值税专用发票' },
        { name: '质保金', condition: '质保期结束', amount: '10%', deadline: '5个工作日', invoice: '增值税专用发票' }
    ];

    paymentPatterns.forEach(pattern => {
        if (contractContent.includes(pattern.name)) {
            paymentRisk.nodes.push(pattern);
        }
    });

    // Add payment risks
    paymentRisk.risks = [
        { point: '预付款延迟', source: '客户资金周转困难', level: '中', impact: '中' },
        { point: '进度款延迟', source: '客户对交付成果不满意', level: '高', impact: '高' },
        { point: '验收款延迟', source: '客户拖延验收', level: '高', impact: '高' }
    ];

    // Add prevention and collection strategies
    paymentRisk.strategies = [
        {
            risk: '预付款延迟',
            prevention: '合同中明确预付款逾期的违约责任',
            collection: '逾期3个工作日内发送催款函',
            warning: '合同签订后2个工作日'
        },
        {
            risk: '进度款延迟',
            prevention: '建立交付成果评审机制',
            collection: '逾期3个工作日内项目经理上门沟通',
            warning: '交付完成后1个工作日'
        },
        {
            risk: '验收款延迟',
            prevention: '制定详细的验收计划',
            collection: '逾期5个工作日内发送正式催款函',
            warning: '项目提交验收后2个工作日'
        }
    ];

    return paymentRisk;
}

function verifyAmounts(contractContent) {
    const result = {
        consistent: true,
        inconsistencies: []
    };

    // Extract amounts (simplified pattern matching)
    const amountPattern = /(\d+(?:\.\d{2})?)[\s元]*[\s壹贰叁肆伍陆柒捌玖拾佰仟万亿]*元整?/g;
    const matches = contractContent.match(amountPattern);

    if (matches) {
        matches.forEach(match => {
            const numbers = match.match(/\d+(?:\.\d{2})?/);
            if (numbers) {
                const numericAmount = parseFloat(numbers[0]);
                const chineseAmount = match.replace(numericAmount.toString(), '').trim();

                // Simple check - in production, implement proper Chinese number conversion
                if (numericAmount < 10000 && !chineseAmount.includes('万')) {
                    result.inconsistencies.push({
                        amount: numericAmount.toFixed(2),
                        chineseAmount: chineseAmount,
                        result: '不一致',
                        reason: '中文大写格式可能不正确'
                    });
                    result.consistent = false;
                }
            }
        });
    }

    return result;
}

function verifyPeriod(contractContent) {
    const result = {
        analysis: null,
        risk: null
    };

    // Extract contract amount
    const amountMatch = contractContent.match(/合同金额[：:]\s*([0-9,]+(?:\.\d{2})?)\s*元/);
    if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));

        // Determine minimum period based on amount
        let minPeriod = '1个月';
        if (amount > 100000 && amount <= 500000) {
            minPeriod = '3个月';
        } else if (amount > 500000 && amount <= 1000000) {
            minPeriod = '3个月';
        } else if (amount > 1000000 && amount <= 5000000) {
            minPeriod = '6个月';
        } else if (amount > 5000000 && amount <= 10000000) {
            minPeriod = '12个月';
        } else if (amount > 10000000) {
            minPeriod = '24个月';
        }

        // Extract agreed period (simplified)
        const periodMatch = contractContent.match(/合同周期[：:]\s*(\d+)\s*(?:个月|月)/);
        const agreedPeriod = periodMatch ? `${periodMatch[1]}个月` : '未明确';

        result.analysis = {
            amount: amount.toLocaleString() + '元',
            minPeriod: minPeriod,
            agreedPeriod: agreedPeriod,
            meetsRequirement: agreedPeriod !== '未明确'
        };

        if (agreedPeriod !== '未明确') {
            const agreedMonths = parseInt(periodMatch[1]);
            const minMonths = parseInt(minPeriod);

            if (agreedMonths < minMonths) {
                result.analysis.meetsRequirement = false;
                result.risk = `合同约定周期(${agreedMonths}个月)低于最低要求(${minMonths}个月)，建议延长合同周期或调整合同金额。`;
            }
        } else {
            result.risk = '合同中未明确约定周期，建议补充周期条款。';
            result.analysis.meetsRequirement = false;
        }
    }

    return result;
}

function buildRiskSummary(result) {
    const summary = [];

    // Collect all risks from different sections
    Object.keys(result.riskAnalysis).forEach(category => {
        result.riskAnalysis[category].forEach(risk => {
            summary.push({
                point: risk.point,
                source: category,
                level: risk.level,
                impact: risk.impact,
                measure: risk.response,
                reason: risk.prevention,
                responsible: risk.responsible,
                deadline: risk.keyPoint
            });
        });
    });

    // Add payment risks
    if (result.paymentRisk.risks) {
        result.paymentRisk.risks.forEach(risk => {
            const strategy = result.paymentRisk.strategies.find(s => s.risk === risk.point);
            summary.push({
                point: risk.point,
                source: '回款风险',
                level: risk.level,
                impact: risk.impact,
                measure: strategy?.collection || '未制定',
                reason: strategy?.prevention || '未制定',
                responsible: '财务部',
                deadline: strategy?.warning || '未指定'
            });
        });
    }

    return summary;
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Error:', error);
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: '文件大小超过限制（最大10MB）' });
        }
    }
    res.status(500).json({ error: '服务器错误: ' + error.message });
});

// Start server
app.listen(port, () => {
    console.log(`企业合同智能分析系统运行在 http://localhost:${port}`);
    console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});
