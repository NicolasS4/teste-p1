// ===== CONFIGURAÇÃO DO SISTEMA =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

// Configuração do tema
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// ===== ELEMENTOS DO SISTEMA =====
const verifyBtn = document.getElementById('verifyBtn');
const newsInput = document.getElementById('newsInput');
const resultContainer = document.getElementById('resultContainer');
const percentageElement = document.getElementById('percentage');
const progressBar = document.getElementById('progressBar');
const resultDescription = document.getElementById('resultDescription');
const charCount = document.getElementById('charCount');
const levelBadge = document.getElementById('levelBadge');
const confidenceLevel = document.getElementById('confidenceLevel');
const analysisDetails = document.getElementById('analysisDetails');
const analysisLog = document.getElementById('analysisLog');

// ===== CONFIGURAÇÕES DO MODELO =====
const STOPWORDS = [
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas', 'de', 'do', 'da', 
    'dos', 'das', 'em', 'no', 'na', 'nos', 'nas', 'por', 'para', 'com', 
    'sem', 'sob', 'sobre', 'entre', 'que', 'e', 'é', 'se', 'como', 'mais', 
    'mas', 'ou', 'nao', 'não', 'ser', 'estar', 'ter', 'haver', 'poder'
];

const FAKE_INDICATORS = [
    'urgente', 'atenção', 'alerta', 'compartilhe', 'vírus', 'perigo',
    'secretamente', 'escondem', 'mentira', 'verdade oculta', 'governo esconde',
    'mídia mente', '100% garantido', 'comprovado', 'cientistas dizem',
    'especialistas revelam', 'shocking', 'breaking', 'exclusivo'
];

const TRUST_INDICATORS = [
    'segundo estudo', 'de acordo com pesquisa', 'fontes oficiais',
    'conforme dados', 'baseado em evidências', 'pesquisa publicada',
    'revista científica', 'especialista em', 'professor doutor',
    'universidade', 'instituto', 'organização mundial'
];

// ===== CONTADOR DE CARACTERES =====
newsInput.addEventListener('input', () => {
    const count = newsInput.value.length;
    charCount.textContent = count;
    
    if (count > 0) {
        verifyBtn.disabled = false;
    } else {
        verifyBtn.disabled = true;
    }
});

// ===== BOTÃO DE VERIFICAÇÃO =====
verifyBtn.addEventListener('click', async () => {
    const newsText = newsInput.value.trim();
    
    if (newsText === '') {
        showNotification('Por favor, insira uma notícia para verificar.', 'error');
        return;
    }
    
    if (newsText.length < 50) {
        showNotification('A notícia precisa ter pelo menos 50 caracteres para análise precisa.', 'error');
        return;
    }
    
    if (newsText.length > 10000) {
        showNotification('A notícia é muito longa. Limite: 10.000 caracteres.', 'error');
        return;
    }
    
    // Iniciar processo de análise
    verifyBtn.classList.add('loading');
    verifyBtn.disabled = true;
    
    // Limpar resultado anterior
    resultContainer.classList.remove('active');
    analysisDetails.innerHTML = '';
    analysisLog.innerHTML = '';
    
    // Mostrar painel de análise
    analysisDetails.classList.add('active');
    
    // Simular processo de análise em etapas
    await simulateAnalysisProcess(newsText);
    
    verifyBtn.classList.remove('loading');
    verifyBtn.disabled = false;
});

// ===== SIMULAÇÃO DO PROCESSO DE ANÁLISE =====
async function simulateAnalysisProcess(text) {
    // Etapa 1: Pré-processamento
    await addAnalysisLog('🔍 Iniciando análise do texto...', 'info');
    await delay(800);
    
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;
    await addAnalysisLog(`📊 ${totalWords} palavras identificadas`, 'info');
    
    // Etapa 2: Remoção de stopwords
    await addAnalysisLog('🧹 Removendo stopwords...', 'process');
    await delay(600);
    
    const meaningfulWords = words.filter(word => 
        word.length > 2 && !STOPWORDS.includes(word.replace(/[.,!?;:]/g, ''))
    );
    await addAnalysisLog(`✅ ${meaningfulWords.length} palavras significativas`, 'success');
    
    // Etapa 3: Análise de padrões
    await addAnalysisLog('🔬 Analisando padrões linguísticos...', 'process');
    await delay(800);
    
    const fakeScore = analyzeFakeIndicators(text, meaningfulWords);
    const trustScore = analyzeTrustIndicators(text, meaningfulWords);
    
    // Etapa 4: Cálculo TF-IDF (simulado)
    await addAnalysisLog('🧮 Calculando importância dos termos (TF-IDF)...', 'process');
    await delay(1000);
    
    const tfidfScore = calculateTFIDFScore(meaningfulWords);
    
    // Etapa 5: Classificação
    await addAnalysisLog('🤖 Aplicando modelo de classificação...', 'process');
    await delay(1200);
    
    const finalPercentage = calculateFinalScore(fakeScore, trustScore, tfidfScore, text.length);
    
    // Etapa 6: Exibir resultados
    await addAnalysisLog('📈 Gerando relatório de análise...', 'process');
    await delay(600);
    
    updateResult(finalPercentage, text, {
        fakeScore,
        trustScore,
        tfidfScore,
        meaningfulWords: meaningfulWords.length,
        totalWords
    });
    
    await addAnalysisLog('🎉 Análise concluída com sucesso!', 'success');
}

// ===== FUNÇÕES DE ANÁLISE =====
function analyzeFakeIndicators(text, words) {
    let score = 0;
    const indicatorsFound = [];
    
    FAKE_INDICATORS.forEach(indicator => {
        if (text.toLowerCase().includes(indicator)) {
            score += 2;
            indicatorsFound.push(indicator);
        }
    });
    
    // Análise de padrões de texto
    if (text.includes('!!!') || text.includes('???')) score += 1;
    if (text.toUpperCase() === text) score += 3;
    if (text.includes('R$') && text.match(/\d{6,}/)) score += 1; // Valores muito altos
    if (text.includes('%') && text.match(/\d{3,}%/)) score += 1; // Porcentagens exageradas
    
    if (indicatorsFound.length > 0) {
        addAnalysisLog(`⚠️ Indicadores de fake news encontrados: ${indicatorsFound.slice(0, 3).join(', ')}`, 'warning');
    }
    
    return Math.min(10, score);
}

function analyzeTrustIndicators(text, words) {
    let score = 0;
    const indicatorsFound = [];
    
    TRUST_INDICATORS.forEach(indicator => {
        if (text.toLowerCase().includes(indicator)) {
            score += 2;
            indicatorsFound.push(indicator);
        }
    });
    
    // Pontuação por estrutura
    if (text.includes('http://') || text.includes('https://')) score += 1;
    if (text.includes('"') && text.match(/"[^"]+"/g)?.length >= 2) score += 1; // Citações
    if (text.includes('Segundo') || text.includes('Conforme')) score += 1;
    if (text.includes('estudo') || text.includes('pesquisa')) score += 1;
    
    if (indicatorsFound.length > 0) {
        addAnalysisLog(`✅ Indicadores de confiança encontrados: ${indicatorsFound.slice(0, 3).join(', ')}`, 'success');
    }
    
    return Math.min(10, score);
}

function calculateTFIDFScore(words) {
    // Simulação simplificada de TF-IDF
    const wordFrequency = {};
    words.forEach(word => {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    const uniqueWords = Object.keys(wordFrequency);
    const totalUniqueWords = uniqueWords.length;
    
    // Calcular "importância" baseada em frequência e raridade
    let tfidfScore = 0;
    uniqueWords.forEach(word => {
        const tf = wordFrequency[word] / words.length;
        const idf = Math.log(words.length / (wordFrequency[word] || 1));
        tfidfScore += tf * idf;
    });
    
    // Normalizar para 0-10
    return Math.min(10, tfidfScore * 2);
}

function calculateFinalScore(fakeScore, trustScore, tfidfScore, textLength) {
    // Fórmula de classificação (simplificada)
    let baseScore = 50; // Pontuação base
    
    // Ajustes baseados nas análises
    baseScore -= fakeScore * 3; // Penaliza indicadores de fake news
    baseScore += trustScore * 2; // Recompensa indicadores de confiança
    baseScore += tfidfScore; // Adiciona pontuação TF-IDF
    
    // Ajustes baseados no comprimento
    if (textLength > 1000) baseScore += 5; // Textos longos tendem a ser mais detalhados
    if (textLength < 200) baseScore -= 10; // Textos muito curtos são suspeitos
    
    // Limitar entre 0-100
    return Math.max(0, Math.min(100, Math.round(baseScore)));
}

// ===== ATUALIZAÇÃO DE RESULTADOS =====
function updateResult(percentage, text, analysisData) {
    percentageElement.textContent = `${percentage}%`;
    
    progressBar.style.width = `${percentage}%`;
    
    let level, description, badgeText, badgeClass;
    
    if (percentage < 30) {
        progressBar.className = 'progress veracity-low';
        level = 'low';
        badgeText = 'PROVAVELMENTE FALSA';
        badgeClass = 'badge-danger';
        description = 'Esta notícia apresenta várias características comuns em desinformação. Recomendamos verificar em fontes oficiais antes de compartilhar.';
    } else if (percentage < 50) {
        progressBar.className = 'progress veracity-medium-low';
        level = 'medium-low';
        badgeText = 'SUSPEITA';
        badgeClass = 'badge-warning';
        description = 'Há indícios de informações incorretas ou fora de contexto. Consulte outras fontes confiáveis para confirmar.';
    } else if (percentage < 70) {
        progressBar.className = 'progress veracity-medium';
        level = 'medium';
        badgeText = 'POSSIVELMENTE VERDADEIRA';
        badgeClass = 'badge-info';
        description = 'A notícia parece ter fundamento, mas alguns pontos podem precisar de confirmação adicional.';
    } else if (percentage < 85) {
        progressBar.className = 'progress veracity-high';
        level = 'high';
        badgeText = 'PROVAVELMENTE VERDADEIRA';
        badgeClass = 'badge-success';
        description = 'As informações parecem consistentes e bem fundamentadas. A notícia tem alta probabilidade de ser verdadeira.';
    } else {
        progressBar.className = 'progress veracity-very-high';
        level = 'very-high';
        badgeText = 'ALTAMENTE CONFIÁVEL';
        badgeClass = 'badge-success';
        description = 'Esta notícia apresenta todas as características de informações verificadas e confiáveis.';
    }
    
    levelBadge.textContent = badgeText;
    levelBadge.className = `badge ${badgeClass}`;
    resultDescription.textContent = description;
    
    // Adicionar detalhes da análise
    addAnalysisDetails(analysisData, percentage);
    
    // Mostrar resultados
    resultContainer.classList.add('active');
    
    // Scroll para resultados
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    showNotification('Análise concluída! Resultado disponível abaixo.', 'success');
}

function addAnalysisDetails(data, percentage) {
    const detailsHTML = `
        <div class="analysis-stats">
            <div class="stat-row">
                <div class="stat-item">
                    <span class="stat-label">Palavras analisadas:</span>
                    <span class="stat-value">${data.totalWords}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Palavras significativas:</span>
                    <span class="stat-value">${data.meaningfulWords}</span>
                </div>
            </div>
            
            <div class="stat-row">
                <div class="stat-item">
                    <span class="stat-label">Score Fake Indicators:</span>
                    <span class="stat-value ${data.fakeScore > 5 ? 'text-danger' : 'text-success'}">${data.fakeScore}/10</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Score Trust Indicators:</span>
                    <span class="stat-value ${data.trustScore > 5 ? 'text-success' : 'text-warning'}">${data.trustScore}/10</span>
                </div>
            </div>
            
            <div class="progress-bars">
                <div class="progress-item">
                    <span class="progress-label">Confiança do modelo:</span>
                    <div class="progress-bar-small">
                        <div class="progress-fill-small" style="width: ${Math.min(100, percentage + 15)}%"></div>
                    </div>
                    <span class="progress-value">${Math.min(100, percentage + 15)}%</span>
                </div>
            </div>
            
            <div class="analysis-recommendations">
                <h4><i class="fas fa-lightbulb"></i> Recomendações</h4>
                <ul>
                    ${percentage < 50 ? 
                        '<li><i class="fas fa-exclamation-triangle"></i> Verifique em sites oficiais do governo</li>' +
                        '<li><i class="fas fa-search"></i> Consulte agências de fact-checking</li>' +
                        '<li><i class="fas fa-share-alt-slash"></i> Evite compartilhar até confirmar</li>' :
                        '<li><i class="fas fa-check-circle"></i> A notícia parece confiável</li>' +
                        '<li><i class="fas fa-newspaper"></i> Consulte sempre múltiplas fontes</li>' +
                        '<li><i class="fas fa-graduation-cap"></i> Desenvolva senso crítico sobre fontes</li>'
                    }
                </ul>
            </div>
        </div>
    `;
    
    analysisDetails.innerHTML = detailsHTML;
}

// ===== FUNÇÕES AUXILIARES =====
async function addAnalysisLog(message, type = 'info') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${type}`;
    
    const icons = {
        'info': 'fas fa-info-circle',
        'process': 'fas fa-cog fa-spin',
        'success': 'fas fa-check-circle',
        'warning': 'fas fa-exclamation-triangle',
        'error': 'fas fa-times-circle'
    };
    
    logEntry.innerHTML = `
        <i class="${icons[type] || 'fas fa-info-circle'}"></i>
        <span>${message}</span>
        <span class="log-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    `;
    
    analysisLog.appendChild(logEntry);
    analysisLog.scrollTop = analysisLog.scrollHeight;
    
    await delay(300);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== BOTÕES DE CONTROLE =====
document.querySelector('.new-check-btn')?.addEventListener('click', () => {
    newsInput.value = '';
    resultContainer.classList.remove('active');
    analysisDetails.classList.remove('active');
    analysisDetails.innerHTML = '';
    analysisLog.innerHTML = '';
    charCount.textContent = '0';
    verifyBtn.disabled = true;
    newsInput.focus();
    
    showNotification('Pronto para nova análise!', 'info');
});

document.querySelector('.share-btn')?.addEventListener('click', () => {
    if (!resultContainer.classList.contains('active')) {
        showNotification('Nenhum resultado para compartilhar.', 'warning');
        return;
    }
    
    const shareText = `Verifiquei uma notícia no VERINEX: ${percentageElement.textContent} de confiança. ${resultDescription.textContent}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Resultado da Verificação - VERINEX',
            text: shareText,
            url: window.location.href
        }).catch(() => {
            copyToClipboard(shareText);
        });
    } else {
        copyToClipboard(shareText);
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => showNotification('Resultado copiado para a área de transferência!', 'success'))
        .catch(() => showNotification('Não foi possível copiar o resultado.', 'error'));
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-triangle',
        'warning': 'fa-exclamation-circle',
        'info': 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icons[type]}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Fechar notificação
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== EXEMPLOS PRÉ-DEFINIDOS =====
document.addEventListener('DOMContentLoaded', () => {
    newsInput.focus();
    verifyBtn.disabled = true;
    
    // Adicionar exemplos rápidos
    addQuickExamples();
    
    // Configurar menu mobile
    setupMobileMenu();
});

function addQuickExamples() {
    const examplesContainer = document.querySelector('.quick-examples');
    if (!examplesContainer) return;
    
    const examples = [
        {
            text: "Estudo comprova que vacinas alteram DNA humano permanentemente",
            type: "fake"
        },
        {
            text: "Governo anuncia novo programa de incentivo à pesquisa científica nas universidades federais",
            type: "true"
        },
        {
            text: "ALERTA: Nova variante do vírus é 500% mais contagiosa, dizem cientistas",
            type: "fake"
        }
    ];
    
    examples.forEach(example => {
        const button = document.createElement('button');
        button.className = `example-btn example-${example.type}`;
        button.innerHTML = `
            <span class="example-text">${example.text.substring(0, 60)}...</span>
            <span class="example-badge">${example.type === 'fake' ? 'Exemplo Falso' : 'Exemplo Verdadeiro'}</span>
        `;
        
        button.addEventListener('click', () => {
            newsInput.value = example.text;
            newsInput.dispatchEvent(new Event('input'));
            showNotification('Exemplo carregado! Clique em "Verificar" para analisar.', 'info');
        });
        
        examplesContainer.appendChild(button);
    });
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    
    if (!mobileMenuBtn || !mobileNav) return;
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
    
    // Fechar menu ao clicar em um link
    const mobileLinks = mobileNav.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    });
}

// ===== ANIMAÇÕES CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    }
    
    .notification-success {
        background: #4CAF50;
        color: white;
    }
    
    .notification-error {
        background: #f44336;
        color: white;
    }
    
    .notification-warning {
        background: #ff9800;
        color: white;
    }
    
    .notification-info {
        background: #2196F3;
        color: white;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
    }
    
    .log-entry {
        padding: 8px 12px;
        border-radius: 6px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        align-items: center;
        gap: 10px;
        animation: fadeIn 0.3s ease;
    }
    
    .log-info {
        border-left: 3px solid #2196F3;
    }
    
    .log-process {
        border-left: 3px solid #FF9800;
    }
    
    .log-success {
        border-left: 3px solid #4CAF50;
    }
    
    .log-warning {
        border-left: 3px solid #FF9800;
    }
    
    .log-error {
        border-left: 3px solid #F44336;
    }
    
    .log-time {
        margin-left: auto;
        font-size: 0.8em;
        opacity: 0.7;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .analysis-stats {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 20px;
        margin-top: 20px;
    }
    
    .stat-row {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;
    }
    
    .stat-item {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .stat-label {
        color: rgba(255, 255, 255, 0.8);
        font-size: 0.9em;
    }
    
    .stat-value {
        font-weight: bold;
        font-family: 'Courier New', monospace;
    }
    
    .text-danger { color: #F44336; }
    .text-success { color: #4CAF50; }
    .text-warning { color: #FF9800; }
    
    .progress-bars {
        margin: 20px 0;
    }
    
    .progress-item {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 10px;
    }
    
    .progress-label {
        min-width: 150px;
        color: rgba(255, 255, 255, 0.8);
    }
    
    .progress-bar-small {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .progress-fill-small {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #2196F3);
        border-radius: 4px;
        transition: width 1s ease;
    }
    
    .progress-value {
        min-width: 50px;
        text-align: right;
        font-weight: bold;
    }
    
    .analysis-recommendations {
        margin-top: 25px;
        padding-top: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .analysis-recommendations h4 {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
        color: #4FC3F7;
    }
    
    .analysis-recommendations ul {
        list-style: none;
        padding-left: 0;
    }
    
    .analysis-recommendations li {
        padding: 8px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        color: rgba(255, 255, 255, 0.8);
    }
    
    .analysis-recommendations li i {
        color: #4FC3F7;
    }
    
    .quick-examples {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-top: 20px;
    }
    
    .example-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 12px 15px;
        color: white;
        text-align: left;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .example-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-2px);
    }
    
    .example-fake {
        border-left: 4px solid #F44336;
    }
    
    .example-true {
        border-left: 4px solid #4CAF50;
    }
    
    .example-text {
        flex: 1;
        font-size: 0.9em;
    }
    
    .example-badge {
        background: rgba(255, 255, 255, 0.1);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        font-weight: bold;
        margin-left: 10px;
    }
    
    .example-fake .example-badge {
        background: rgba(244, 67, 54, 0.2);
        color: #F44336;
    }
    
    .example-true .example-badge {
        background: rgba(76, 175, 80, 0.2);
        color: #4CAF50;
    }
    
    @media (max-width: 768px) {
        .stat-row {
            flex-direction: column;
            gap: 10px;
        }
        
        .progress-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }
        
        .progress-label {
            min-width: auto;
        }
        
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

// ===== VALIDAÇÃO DE ENTRADA EM TEMPO REAL =====
newsInput.addEventListener('keydown', (e) => {
    // Limitar entrada a 10000 caracteres
    if (newsInput.value.length >= 10000 && e.key !== 'Backspace' && e.key !== 'Delete') {
        e.preventDefault();
        showNotification('Limite de 10.000 caracteres atingido.', 'warning');
    }
});

// ===== DETECÇÃO DE IDIOMA =====
newsInput.addEventListener('blur', () => {
    const text = newsInput.value.trim();
    if (text.length < 10) return;
    
    // Detecção simples de idioma (português vs outros)
    const portugueseWords = ['de', 'do', 'da', 'em', 'que', 'não', 'para', 'com'];
    let portugueseCount = 0;
    
    portugueseWords.forEach(word => {
        if (text.toLowerCase().includes(` ${word} `)) {
            portugueseCount++;
        }
    });
    
    if (portugueseCount < 3 && text.length > 50) {
        showNotification('O sistema funciona melhor com textos em português.', 'info');
    }
});

// ===== AUTO-SAVE =====
let autoSaveTimeout;
newsInput.addEventListener('input', () => {
    clearTimeout(autoSaveTimeout);
    
    if (newsInput.value.length > 100) {
        autoSaveTimeout = setTimeout(() => {
            localStorage.setItem('verinex_last_text', newsInput.value);
        }, 2000);
    }
});

// Recuperar texto salvo
window.addEventListener('load', () => {
    const savedText = localStorage.getItem('verinex_last_text');
    if (savedText && savedText.length > 0) {
        newsInput.value = savedText;
        newsInput.dispatchEvent(new Event('input'));
        showNotification('Texto anterior recuperado.', 'info');
    }
});

// ===== TELEMETRIA ANÔNIMA =====
function sendAnalytics(action, data = {}) {
    // Implementação segura e anônima de analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            ...data,
            app_name: 'VERINEX',
            app_version: '1.0.0'
        });
    }
}

// Enviar eventos
verifyBtn.addEventListener('click', () => {
    sendAnalytics('verify_click', {
        text_length: newsInput.value.length
    });
});

document.querySelector('.new-check-btn')?.addEventListener('click', () => {
    sendAnalytics('new_check_click');
});

document.querySelector('.share-btn')?.addEventListener('click', () => {
    sendAnalytics('share_click', {
        percentage: percentageElement.textContent
    });
});