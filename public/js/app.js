// File Upload Handling
function setupUploadZone(zoneId, inputId, filenameId) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);
    const filename = document.getElementById(filenameId);

    zone.addEventListener('click', () => input.click());

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            input.files = e.dataTransfer.files;
            updateFilename(input, filename);
        }
    });

    input.addEventListener('change', () => {
        updateFilename(input, filename);
    });
}

function updateFilename(input, filenameElement) {
    if (input.files.length > 0) {
        filenameElement.textContent = `已选择: ${input.files[0].name}`;
        filenameElement.classList.add('text-green-600');
    }
}

// Initialize upload zones
setupUploadZone('contract-upload', 'contract-file', 'contract-filename');
setupUploadZone('standard-upload', 'standard-file', 'standard-filename');
setupUploadZone('redline-upload', 'redline-file', 'redline-filename');

// Analyze button handler
document.getElementById('analyze-btn').addEventListener('click', async () => {
    const contractFile = document.getElementById('contract-file').files[0];

    if (!contractFile) {
        alert('请上传客户合同文件！');
        return;
    }

    const standardFile = document.getElementById('standard-file').files[0];
    const redlineFile = document.getElementById('redline-file').files[0];

    // Show loading
    document.getElementById('upload-section').classList.add('hidden');
    document.getElementById('loading-section').classList.remove('hidden');

    try {
        // Prepare form data
        const formData = new FormData();
        formData.append('contract', contractFile);
        if (standardFile) {
            formData.append('standard', standardFile);
        }
        if (redlineFile) {
            formData.append('redline', redlineFile);
        }

        // Send to backend
        const response = await fetch('/api/analyze', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Hide loading, show results
        document.getElementById('loading-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');

        // Render results
        renderResults(result);

    } catch (error) {
        console.error('Error:', error);
        alert('分析失败：' + error.message);

        // Show upload section again
        document.getElementById('loading-section').classList.add('hidden');
        document.getElementById('upload-section').classList.remove('hidden');
    }
});

// Render analysis results
function renderResults(result) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.innerHTML = '';

    // Summary Section
    resultsSection.innerHTML += createSummarySection(result);

    // Redline Clauses Section
    if (result.redlineClauses) {
        resultsSection.innerHTML += createRedlineSection(result.redlineClauses);
    }

    // Risk Analysis Section
    if (result.riskAnalysis) {
        resultsSection.innerHTML += createRiskAnalysisSection(result.riskAnalysis);
    }

    // Payment Risk Section
    if (result.paymentRisk) {
        resultsSection.innerHTML += createPaymentRiskSection(result.paymentRisk);
    }

    // Amount Verification Section
    if (result.amountVerification) {
        resultsSection.innerHTML += createAmountVerificationSection(result.amountVerification);
    }

    // Period Verification Section
    if (result.periodVerification) {
        resultsSection.innerHTML += createPeriodVerificationSection(result.periodVerification);
    }

    // Risk Summary Section
    if (result.riskSummary) {
        resultsSection.innerHTML += createRiskSummarySection(result.riskSummary);
    }

    // Export button
    resultsSection.innerHTML += createExportSection(result);

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function createSummarySection(result) {
    const riskCount = result.riskSummary?.length || 0;
    const highRisk = result.riskSummary?.filter(r => r.level === '高').length || 0;

    return `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">分析概览</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-blue-50 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-blue-600">${riskCount}</div>
                    <div class="text-sm text-gray-600 mt-2">风险点总数</div>
                </div>
                <div class="bg-red-50 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-red-600">${highRisk}</div>
                    <div class="text-sm text-gray-600 mt-2">高风险项目</div>
                </div>
                <div class="bg-green-50 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-green-600">${result.redlineClauses?.exists ? '存在' : '不存在'}</div>
                    <div class="text-sm text-gray-600 mt-2">红线条款</div>
                </div>
                <div class="bg-yellow-50 rounded-lg p-6 text-center">
                    <div class="text-3xl font-bold text-yellow-600">${result.amountVerification?.consistent ? '一致' : '不一致'}</div>
                    <div class="text-sm text-gray-600 mt-2">金额校验</div>
                </div>
            </div>
        </section>
    `;
}

function createRedlineSection(redlineClauses) {
    if (!redlineClauses.details || redlineClauses.details.length === 0) {
        return `
            <section class="result-section card-shadow p-8 mb-8 fade-in">
                <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">红线条款核查</h2>
                <div class="text-green-600 text-lg font-semibold">✓ 未发现红线条款</div>
            </section>
        `;
    }

    const details = redlineClauses.details.map(d => `
        <tr>
            <td>${d.position}</td>
            <td>${d.type}</td>
            <td>${d.deviation}</td>
            <td>${d.negotiable ? '是' : '否'}</td>
            <td>${d.veto ? '是' : '否'}</td>
        </tr>
    `).join('');

    return `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">红线条款核查</h2>
            <div class="mb-4">
                <span class="status-badge ${redlineClauses.exists ? 'status-warning' : 'status-success'}">
                    ${redlineClauses.exists ? '存在红线条款' : '不存在红线条款'}
                </span>
            </div>
            ${redlineClauses.details && redlineClauses.details.length > 0 ? `
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>条款位置</th>
                                <th>红线条款类型</th>
                                <th>偏离内容</th>
                                <th>是否可协商</th>
                                <th>一票否决项</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${details}
                        </tbody>
                    </table>
                </div>
            ` : ''}
        </section>
    `;
}

function createRiskAnalysisSection(riskAnalysis) {
    const sections = [];

    Object.keys(riskAnalysis).forEach(category => {
        const risks = riskAnalysis[category];
        if (risks && risks.length > 0) {
            const categoryNames = {
                '主体资格风险': 'Contract Entity Risk',
                '条款内容风险': 'Clause Content Risk',
                '履约落地风险': 'Performance Risk',
                '法律合规风险': 'Legal Compliance Risk'
            };

            const riskItems = risks.map(risk => `
                <div class="border rounded-lg p-4 mb-3">
                    <div class="flex items-center justify-between mb-2">
                        <h4 class="font-semibold text-gray-800">${risk.point}</h4>
                        <span class="status-badge ${risk.level === '高' ? 'status-danger' : risk.level === '中' ? 'status-warning' : 'status-success'}">
                            ${risk.level}风险
                        </span>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                        <div><strong>发生概率：</strong>${risk.probability}</div>
                        <div><strong>影响程度：</strong>${risk.impact}</div>
                    </div>
                    <div class="text-sm">
                        <div class="mb-1"><strong>预防措施：</strong>${risk.prevention || '无'}</div>
                        <div class="mb-1"><strong>应对措施：</strong>${risk.response || '无'}</div>
                        <div class="mb-1"><strong>责任人：</strong>${risk.responsible || '未指定'}</div>
                        <div><strong>关键节点：</strong>${risk.keyPoint || '未指定'}</div>
                    </div>
                </div>
            `).join('');

            sections.push(`
                <div class="mb-6">
                    <h3 class="text-lg font-semibold mb-4 text-gray-700">${category}</h3>
                    ${riskItems}
                </div>
            `);
        }
    });

    return `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">客户合同风险分析及应对</h2>
            ${sections.join('')}
        </section>
    `;
}

function createPaymentRiskSection(paymentRisk) {
    let html = `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">回款节点与风险管控</h2>
    `;

    // Payment nodes
    if (paymentRisk.nodes && paymentRisk.nodes.length > 0) {
        const nodes = paymentRisk.nodes.map(node => `
            <tr>
                <td>${node.name}</td>
                <td>${node.condition}</td>
                <td>${node.amount}</td>
                <td>${node.deadline}</td>
                <td>${node.invoice}</td>
            </tr>
        `).join('');

        html += `
            <h3 class="text-lg font-semibold mb-4 text-gray-700">回款节点梳理</h3>
            <div class="overflow-x-auto mb-6">
                <table>
                    <thead>
                        <tr>
                            <th>节点名称</th>
                            <th>触发条件</th>
                            <th>回款金额/比例</th>
                            <th>付款期限</th>
                            <th>发票要求</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${nodes}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Risk analysis
    if (paymentRisk.risks && paymentRisk.risks.length > 0) {
        const risks = paymentRisk.risks.map(risk => `
            <tr>
                <td>${risk.point}</td>
                <td>${risk.source}</td>
                <td class="${risk.level === '高' ? 'risk-high' : risk.level === '中' ? 'risk-medium' : 'risk-low'}">${risk.level}</td>
                <td class="${risk.impact === '高' ? 'risk-high' : risk.impact === '中' ? 'risk-medium' : 'risk-low'}">${risk.impact}</td>
            </tr>
        `).join('');

        html += `
            <h3 class="text-lg font-semibold mb-4 text-gray-700">回款风险分析</h3>
            <div class="overflow-x-auto mb-6">
                <table>
                    <thead>
                        <tr>
                            <th>风险点</th>
                            <th>风险来源</th>
                            <th>风险等级</th>
                            <th>影响程度</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${risks}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Prevention and collection strategies
    if (paymentRisk.strategies && paymentRisk.strategies.length > 0) {
        const strategies = paymentRisk.strategies.map(strategy => `
            <tr>
                <td>${strategy.risk}</td>
                <td>${strategy.prevention}</td>
                <td>${strategy.collection}</td>
                <td>${strategy.warning}</td>
            </tr>
        `).join('');

        html += `
            <h3 class="text-lg font-semibold mb-4 text-gray-700">风险防控与催收策略</h3>
            <div class="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>风险点</th>
                            <th>防控策略</th>
                            <th>催收策略</th>
                            <th>预警节点</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${strategies}
                    </tbody>
                </table>
            </div>
        `;
    }

    html += `</section>`;
    return html;
}

function createAmountVerificationSection(amountVerification) {
    return `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">合同金额大小写一致性校验</h2>
            <div class="mb-4">
                <span class="status-badge ${amountVerification.consistent ? 'status-success' : 'status-danger'}">
                    ${amountVerification.consistent ? '一致' : '不一致'}
                </span>
            </div>
            ${amountVerification.inconsistencies && amountVerification.inconsistencies.length > 0 ? `
                <div class="overflow-x-auto">
                    <table>
                        <thead>
                            <tr>
                                <th>数字金额</th>
                                <th>中文大写金额</th>
                                <th>校验结果</th>
                                <th>不匹配原因</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${amountVerification.inconsistencies.map(i => `
                                <tr>
                                    <td>${i.amount}</td>
                                    <td>${i.chineseAmount}</td>
                                    <td>${i.result}</td>
                                    <td>${i.reason || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
        </section>
    `;
}

function createPeriodVerificationSection(periodVerification) {
    return `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">合同金额与周期对应要求</h2>
            ${periodVerification.analysis ? `
                <div class="overflow-x-auto mb-6">
                    <table>
                        <thead>
                            <tr>
                                <th>合同金额</th>
                                <th>对应最低周期</th>
                                <th>合同约定周期</th>
                                <th>是否满足要求</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${periodVerification.analysis.amount}</td>
                                <td>${periodVerification.analysis.minPeriod}</td>
                                <td>${periodVerification.analysis.agreedPeriod}</td>
                                <td class="${periodVerification.analysis.meetsRequirement ? 'text-green-600' : 'text-red-600'}">
                                    ${periodVerification.analysis.meetsRequirement ? '是' : '否'}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ` : ''}
            ${periodVerification.risk ? `
                <div class="bg-red-50 border-l-4 border-red-500 p-4">
                    <h4 class="font-semibold text-red-700 mb-2">周期风险分析</h4>
                    <p class="text-gray-700">${periodVerification.risk}</p>
                </div>
            ` : ''}
        </section>
    `;
}

function createRiskSummarySection(riskSummary) {
    const highRisks = riskSummary.filter(r => r.level === '高');

    let html = `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">风险清单汇总</h2>
    `;

    // Risk summary table
    const summaryRows = riskSummary.map(r => `
        <tr>
            <td>${r.point}</td>
            <td>${r.source}</td>
            <td class="${r.level === '高' ? 'risk-high' : r.level === '中' ? 'risk-medium' : 'risk-low'}">${r.level}</td>
            <td class="${r.impact === '高' ? 'risk-high' : r.impact === '中' ? 'risk-medium' : 'risk-low'}">${r.impact}</td>
            <td>${r.measure}</td>
        </tr>
    `).join('');

    html += `
        <h3 class="text-lg font-semibold mb-4 text-gray-700">风险汇总</h3>
        <div class="overflow-x-auto mb-6">
            <table>
                <thead>
                    <tr>
                        <th>风险点</th>
                        <th>风险来源</th>
                        <th>风险等级</th>
                        <th>影响程度</th>
                        <th>应对措施</th>
                    </tr>
                </thead>
                <tbody>
                    ${summaryRows}
                </tbody>
            </table>
        </div>
    `;

    // High risk special handling
    if (highRisks.length > 0) {
        const highRiskItems = highRisks.map(r => `
            <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-3">
                <h4 class="font-semibold text-red-700 mb-2">${r.point}</h4>
                <p class="text-sm text-gray-600 mb-2"><strong>风险原因：</strong>${r.reason || '未说明'}</p>
                <p class="text-sm text-gray-600 mb-2"><strong>应对方案：</strong>${r.measure || '未说明'}</p>
                <div class="text-sm">
                    <strong>责任人：</strong>${r.responsible || '未指定'} | <strong>时间节点：</strong>${r.deadline || '未指定'}
                </div>
            </div>
        `).join('');

        html += `
            <h3 class="text-lg font-semibold mb-4 text-gray-700">高风险项目专项应对</h3>
            ${highRiskItems}
        `;
    }

    html += `</section>`;
    return html;
}

function createExportSection(result) {
    return `
        <section class="result-section card-shadow p-8 mb-8 fade-in">
            <h2 class="font-display text-2xl font-bold mb-6 text-gray-800">导出报告</h2>
            <div class="flex gap-4">
                <button onclick="exportToMarkdown()" class="btn-secondary text-white px-6 py-3 rounded-lg font-semibold">
                    导出 Markdown 报告
                </button>
                <button onclick="resetAnalysis()" class="btn-primary text-white px-6 py-3 rounded-lg font-semibold">
                    分析新的合同
                </button>
            </div>
        </section>
    `;
}

function exportToMarkdown() {
    // Implement markdown export
    alert('导出功能开发中...');
}

function resetAnalysis() {
    document.getElementById('results-section').classList.add('hidden');
    document.getElementById('upload-section').classList.remove('hidden');

    // Reset file inputs
    document.getElementById('contract-file').value = '';
    document.getElementById('standard-file').value = '';
    document.getElementById('redline-file').value = '';

    // Reset filenames
    document.getElementById('contract-filename').textContent = '';
    document.getElementById('standard-filename').textContent = '';
    document.getElementById('redline-filename').textContent = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
