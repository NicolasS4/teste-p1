const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

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

const verifyBtn = document.getElementById('verifyBtn');
const newsInput = document.getElementById('newsInput');
const resultContainer = document.getElementById('resultContainer');
const percentageElement = document.getElementById('percentage');
const progressBar = document.getElementById('progressBar');
const resultDescription = document.getElementById('resultDescription');
const charCount = document.getElementById('charCount');
const levelBadge = document.getElementById('levelBadge');
const confidenceLevel = document.getElementById('confidenceLevel');

newsInput.addEventListener('input', () => {
    const count = newsInput.value.length;
    charCount.textContent = count;
    
    if (count > 0) {
        verifyBtn.disabled = false;
    } else {
        verifyBtn.disabled = true;
    }
});

verifyBtn.addEventListener('click', () => {
    const newsText = newsInput.value.trim();
    
    if (newsText === '') {
        showNotification('Por favor, insira uma notícia para verificar.', 'error');
        return;
    }
    
    if (newsText.length < 10) {
        showNotification('A notícia precisa ter pelo menos 10 caracteres.', 'error');
        return;
    }
    
    verifyBtn.classList.add('loading');
    verifyBtn.disabled = true;
    
    setTimeout(() => {
        const veracityPercentage = calculateVeracityPercentage(newsText);
        
        updateResult(veracityPercentage, newsText);
        
        verifyBtn.classList.remove('loading');
        verifyBtn.disabled = false;
    }, 2000);
});

function calculateVeracityPercentage(text) {
    let basePercentage = Math.floor(Math.random() * 40) + 30;
    
    if (text.length > 500) basePercentage += 10;
    if (text.includes('https://') || text.includes('http://')) basePercentage += 5;
    if (text.toLowerCase().includes('fake') || text.toLowerCase().includes('falso')) basePercentage -= 15;
    
    return Math.max(5, Math.min(95, basePercentage));
}

function updateResult(percentage, text) {
    percentageElement.textContent = `${percentage}%`;
    
    progressBar.style.width = `${percentage}%`;
    
    let level, description, badgeText;
    
    if (percentage < 25) {
        progressBar.className = 'progress veracity-low';
        level = 'low';
        badgeText = 'Baixa Confiança';
        description = 'Esta notícia tem baixa probabilidade de ser verdadeira. Recomendamos buscar fontes confiáveis para confirmar as informações e verificar em sites oficiais.';
    } else if (percentage < 50) {
        progressBar.className = 'progress veracity-medium';
        level = 'medium';
        badgeText = 'Confiança Moderada';
        description = 'Esta notícia tem probabilidade moderada de ser verdadeira. Algumas informações podem estar incorretas ou fora de contexto. Consulte fontes adicionais.';
    } else if (percentage < 75) {
        progressBar.className = 'progress veracity-high';
        level = 'high';
        badgeText = 'Alta Confiança';
        description = 'Esta notícia tem alta probabilidade de ser verdadeira. A maioria das informações parece estar correta e bem fundamentada.';
    } else {
        progressBar.className = 'progress veracity-very-high';
        level = 'very-high';
        badgeText = 'Muito Alta Confiança';
        description = 'Esta notícia tem muito alta probabilidade de ser verdadeira. As informações parecem confiáveis, bem fundamentadas e consistentes com fontes verificadas.';
    }
    
    levelBadge.textContent = badgeText;
    resultDescription.textContent = description;
    
    resultContainer.classList.add('active');
    
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    showNotification('Análise concluída com sucesso!', 'success');
}

document.querySelector('.new-check-btn').addEventListener('click', () => {
    newsInput.value = '';
    resultContainer.classList.remove('active');
    charCount.textContent = '0';
    verifyBtn.disabled = true;
    newsInput.focus();
});

document.querySelector('.share-btn').addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: 'Resultado da Verificação - VERINEX',
            text: `Verifiquei uma notícia no VERINEX e o resultado foi ${percentageElement.textContent} de veracidade.`,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(`Verifiquei uma notícia no VERINEX: ${percentageElement.textContent} de veracidade. ${window.location.href}`);
        showNotification('Resultado copiado para a área de transferência!', 'success');
    }
});

function showNotification(message, type) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    newsInput.focus();
    
    verifyBtn.disabled = true;
    
    newsInput.placeholder = "Cole o texto da notícia aqui...\n\nExemplo: 'O governo anunciou hoje um novo programa de auxílio para pequenas empresas afetadas pela pandemia. O valor total do investimento será de R$ 5 bilhões, segundo fontes oficiais.'";
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    const mobileLinks = mobileNav.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}