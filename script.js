// 定义鼓励语数组
const DEFAULT_ENCOURAGEMENTS = [
    "你对自己的爱，值得被看见！",
    "你正在成为你自己！",
    "你的价值无需任何外物来锚定！",
    "你细心地照顾着自己的每一个需要，你真的很棒！",
    "你做到了许多人都做不到的事——照顾好自己的健康！",
    "你认真地对待着自己，你真得很棒！",
    "你对自己的无条件爱与接纳，令人感动！",
    "你如此温柔地照顾着自己，你真的很棒！",
    "无意义的世界上，你的存在即是意义。",
    "你生而拥有整个世界的爱与值得。"
];

// 添加默认维度配置
const DEFAULT_DIMENSIONS = [
    {
        id: 'diet',
        name: '饮食健康',
        description: '记录今天的饮食状况'
    },
    {
        id: 'sleep',
        name: '运动与作息',
        description: '记录今天的运动和作息情况'
    },
    {
        id: 'mood',
        name: '情绪管理',
        description: '记录今天的情绪状态'
    }
];

// 全局变量
let currentCheckInType = '';
let currentGuideStep = 0;
const guideDimensions = [];
const guideTipsContent = [
    "选择一个对你来说重要的生活领域，它可以是健康、学习、关系等任何你想要持续关注和改善的方面。",
    "考虑一个你希望在日常生活中保持追踪的方面，确保这个维度对你的成长有意义。",
    "最后一个维度，想想是否还有其他重要的生活方面需要关注。"
];

// 页面加载时初始化
window.onload = function() {
    checkFirstVisit();
    if (localStorage.getItem('hasVisited')) {
        initializeData();
    }
};

// 检查是否首次访问
function checkFirstVisit() {
    if (!localStorage.getItem('hasVisited')) {
        showWelcomeScreen();
    } else {
        showMainScreen();
    }
}

// 显示/隐藏界面函数
function showWelcomeScreen() {
    document.getElementById('welcomeScreen').classList.remove('d-none');
    document.getElementById('guideScreen').classList.add('d-none');
    document.getElementById('mainScreen').classList.add('d-none');
}

function showGuideScreen() {
    document.getElementById('welcomeScreen').classList.add('d-none');
    document.getElementById('guideScreen').classList.remove('d-none');
    document.getElementById('mainScreen').classList.add('d-none');
    updateGuideProgress();
}

function showMainScreen() {
    document.getElementById('welcomeScreen').classList.add('d-none');
    document.getElementById('guideScreen').classList.add('d-none');
    document.getElementById('mainScreen').classList.remove('d-none');
}

// 引导流程相关函数
function startGuide() {
    currentGuideStep = 0;
    guideDimensions.length = 0;
    showGuideScreen();
}

function updateGuideProgress() {
    const progress = ((currentGuideStep + 1) / 3) * 100;
    document.getElementById('guideProgress').style.width = `${progress}%`;
    document.getElementById('currentStep').textContent = currentGuideStep + 1;
    document.getElementById('guideTips').textContent = guideTipsContent[currentGuideStep];
    
    document.getElementById('prevBtn').disabled = currentGuideStep === 0;
    document.getElementById('nextBtn').textContent = currentGuideStep === 2 ? '完成' : '下一步';
    
    if (guideDimensions[currentGuideStep]) {
        document.getElementById('dimensionName').value = guideDimensions[currentGuideStep].name;
        document.getElementById('dimensionDesc').value = guideDimensions[currentGuideStep].description;
    } else {
        document.getElementById('dimensionName').value = '';
        document.getElementById('dimensionDesc').value = '';
    }
}

function previousStep() {
    if (currentGuideStep > 0) {
        currentGuideStep--;
        updateGuideProgress();
    }
}

function nextStep() {
    const name = document.getElementById('dimensionName').value.trim();
    const description = document.getElementById('dimensionDesc').value.trim();
    
    if (!name) {
        alert('请输入维度名称');
        return;
    }
    
    guideDimensions[currentGuideStep] = {
        id: `dim_${currentGuideStep}`,
        name: name,
        description: description
    };
    
    if (currentGuideStep < 2) {
        currentGuideStep++;
        updateGuideProgress();
    } else {
        finishGuide();
    }
}

function finishGuide() {
    localStorage.setItem('dimensions', JSON.stringify(guideDimensions));
    document.getElementById('guideScreen').classList.add('d-none');
    document.getElementById('encouragementGuide').classList.remove('d-none');
}

// 初始化数据函数
function initializeData() {
    try {
        // 初始化鼓励语数据和偏好设置
        if (!localStorage.getItem('encouragementPreference')) {
            localStorage.setItem('encouragementPreference', 'default');
        }
        
        if (!localStorage.getItem('encouragements')) {
            localStorage.setItem('encouragements', JSON.stringify({
                default: DEFAULT_ENCOURAGEMENTS,
                custom: []
            }));
        }
        
        // 初始化维度数据
        if (!localStorage.getItem('dimensions')) {
            localStorage.setItem('dimensions', JSON.stringify(DEFAULT_DIMENSIONS));
        }

        // 初始化打卡数据
        let checkInData = JSON.parse(localStorage.getItem('checkInData'));
        if (!checkInData || typeof checkInData !== 'object') {
            checkInData = {};
            const dimensions = JSON.parse(localStorage.getItem('dimensions'));
            dimensions.forEach(dim => {
                checkInData[dim.id] = [];
            });
        }
        localStorage.setItem('checkInData', JSON.stringify(checkInData));

        // 初始化记录数据
        let recordData = JSON.parse(localStorage.getItem('recordData'));
        if (!recordData || typeof recordData !== 'object') {
            recordData = {};
        }
        localStorage.setItem('recordData', JSON.stringify(recordData));
    } catch (error) {
        console.error('初始化数据时出错:', error);
        resetAllData();
    }
    
    updateDisplay();
}

// 重置所有数据
function resetAllData() {
    localStorage.setItem('encouragementPreference', 'default');
    localStorage.setItem('encouragements', JSON.stringify({
        default: DEFAULT_ENCOURAGEMENTS,
        custom: []
    }));
    localStorage.setItem('dimensions', JSON.stringify(DEFAULT_DIMENSIONS));
    const defaultCheckInData = {};
    DEFAULT_DIMENSIONS.forEach(dim => {
        defaultCheckInData[dim.id] = [];
    });
    localStorage.setItem('checkInData', JSON.stringify(defaultCheckInData));
    localStorage.setItem('recordData', JSON.stringify({}));
}

// 鼓励语相关函数
function chooseDefaultEncouragements() {
    localStorage.setItem('encouragementPreference', 'default');
    completeSetup();
}

function chooseCustomEncouragements() {
    // 确保encouragements数据已初始化
    if (!localStorage.getItem('encouragements')) {
        localStorage.setItem('encouragements', JSON.stringify({
            default: DEFAULT_ENCOURAGEMENTS,
            custom: []
        }));
    }
    
    document.getElementById('encouragementGuide').classList.add('d-none');
    document.getElementById('customEncouragementGuide').classList.remove('d-none');
    updateCustomEncouragementsList();
}

function addCustomEncouragementInGuide() {
    const text = prompt('请输入新的鼓励语：');
    if (text && text.trim()) {
        let encouragements = JSON.parse(localStorage.getItem('encouragements'));
        if (!encouragements) {
            encouragements = {
                default: DEFAULT_ENCOURAGEMENTS,
                custom: []
            };
        }
        encouragements.custom.push(text.trim());
        localStorage.setItem('encouragements', JSON.stringify(encouragements));
        updateCustomEncouragementsList();
    }
}

function updateCustomEncouragementsList() {
    let encouragements = JSON.parse(localStorage.getItem('encouragements'));
    if (!encouragements) {
        encouragements = {
            default: DEFAULT_ENCOURAGEMENTS,
            custom: []
        };
        localStorage.setItem('encouragements', JSON.stringify(encouragements));
    }
    
    const list = document.getElementById('customEncouragementsList');
    list.innerHTML = encouragements.custom.map((text, index) => `
        <div class="card mb-2">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <p class="card-text mb-0">${text}</p>
                    <button class="btn btn-sm btn-danger" 
                        onclick="removeCustomEncouragementInGuide(${index})">删除</button>
                </div>
            </div>
        </div>
    `).join('');
    
    document.getElementById('finishEncouragementBtn').disabled = 
        encouragements.custom.length < 3;
}

function removeCustomEncouragementInGuide(index) {
    let encouragements = JSON.parse(localStorage.getItem('encouragements'));
    if (!encouragements) {
        encouragements = {
            default: DEFAULT_ENCOURAGEMENTS,
            custom: []
        };
    }
    encouragements.custom.splice(index, 1);
    localStorage.setItem('encouragements', JSON.stringify(encouragements));
    updateCustomEncouragementsList();
}

function backToEncouragementChoice() {
    document.getElementById('customEncouragementGuide').classList.add('d-none');
    document.getElementById('encouragementGuide').classList.remove('d-none');
}

function finishCustomEncouragements() {
    let encouragements = JSON.parse(localStorage.getItem('encouragements'));
    if (!encouragements || !encouragements.custom || encouragements.custom.length < 3) {
        alert('请至少添加3条鼓励语');
        return;
    }
    
    localStorage.setItem('encouragementPreference', 'custom');
    completeSetup();
}

function completeSetup() {
    localStorage.setItem('hasVisited', 'true');
    
    const checkInData = {};
    guideDimensions.forEach(dim => {
        checkInData[dim.id] = [];
    });
    localStorage.setItem('checkInData', JSON.stringify(checkInData));
    localStorage.setItem('recordData', JSON.stringify({}));
    
    showMainScreen();
    updateDisplay();
}

// 获取随机鼓励语
function getRandomEncouragement() {
    const encouragements = JSON.parse(localStorage.getItem('encouragements'));
    const preference = localStorage.getItem('encouragementPreference');
    
    if (preference === 'custom' && encouragements.custom.length > 0) {
        return encouragements.custom[Math.floor(Math.random() * encouragements.custom.length)];
    } else {
        return encouragements.default[Math.floor(Math.random() * encouragements.default.length)];
    }
}

// 打卡相关函数
function checkIn(type) {
    try {
        currentCheckInType = type;
        let data = JSON.parse(localStorage.getItem('checkInData'));
        
        if (!data || typeof data !== 'object') {
            data = {};
            const dimensions = JSON.parse(localStorage.getItem('dimensions'));
            dimensions.forEach(dim => {
                data[dim.id] = [];
            });
        }
        
        if (!Array.isArray(data[type])) {
            data[type] = [];
        }
        
        const today = new Date().toISOString().split('T')[0];
        
        if (!data[type].includes(today)) {
            data[type].push(today);
            localStorage.setItem('checkInData', JSON.stringify(data));
            
            const encouragement = getRandomEncouragement();
            alert(encouragement);
            
            try {
                const recordModal = document.getElementById('recordModal');
                if (!recordModal) {
                    console.error('找不到recordModal元素');
                    return;
                }
                
                const modal = new bootstrap.Modal(recordModal);
                modal.show();
            } catch (error) {
                console.error('显示Modal时出错:', error);
                alert('打卡成功！');
            }
        } else {
            alert('今天已经打过卡啦！');
        }
    } catch (error) {
        console.error('打卡时出错:', error);
        alert('打卡失败，请刷新页面重试');
    }
}

// 保存记录
function saveRecord() {
    const recordContent = document.getElementById('recordContent').value;
    const today = new Date().toISOString().split('T')[0];
    const recordData = JSON.parse(localStorage.getItem('recordData'));
    
    if (!recordData[today]) {
        recordData[today] = {};
    }
    recordData[today][currentCheckInType] = recordContent;
    
    localStorage.setItem('recordData', JSON.stringify(recordData));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('recordModal'));
    modal.hide();
    
    document.getElementById('recordContent').value = '';
    
    updateDisplay();
}

// 计算连续打卡天数
function calculateStreak(dates) {
    if (!Array.isArray(dates)) {
        console.error('无效的日期数组:', dates);
        return 0;
    }
    
    if (!dates.length) return 0;
    
    try {
        dates.sort((a, b) => new Date(b) - new Date(a));
        const today = new Date().toISOString().split('T')[0];
        let streak = 0;
        let currentDate = new Date(today);
        
        for (let date of dates) {
            if (date === currentDate.toISOString().split('T')[0]) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }
        
        return streak;
    } catch (error) {
        console.error('计算连续天数时出错:', error);
        return 0;
    }
}

// 更新显示
function updateDisplay() {
    const dimensions = JSON.parse(localStorage.getItem('dimensions'));
    const data = JSON.parse(localStorage.getItem('checkInData'));
    const recordData = JSON.parse(localStorage.getItem('recordData'));
    
    const cardsContainer = document.querySelector('.row.g-4.mb-5');
    cardsContainer.innerHTML = '';
    
    dimensions.forEach(dim => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card h-100">
                <div class="card-body text-center">
                    <h3>${dim.name}</h3>
                    <p class="text-muted">${dim.description}</p>
                    <button class="btn btn-primary" onclick="checkIn('${dim.id}')">打卡</button>
                    <p class="mt-3">已连续打卡: <span id="${dim.id}-streak">0</span> 天</p>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
        
        const streak = calculateStreak(data[dim.id] || []);
        document.getElementById(`${dim.id}-streak`).textContent = streak;
    });
    
    updateRecentRecords(data, recordData);
}

// 更新最近记录
function updateRecentRecords(data, recordData) {
    const dimensions = JSON.parse(localStorage.getItem('dimensions'));
    const recentRecords = document.getElementById('recent-records');
    recentRecords.innerHTML = '';
    
    const allDates = new Set();
    dimensions.forEach(dim => {
        (data[dim.id] || []).forEach(date => allDates.add(date));
    });
    
    const sortedDates = Array.from(allDates).sort((a, b) => new Date(b) - new Date(a)).slice(0, 5);
    
    sortedDates.forEach(date => {
        const completedDims = dimensions.filter(dim => 
            data[dim.id] && data[dim.id].includes(date)
        );
        
        const item = document.createElement('div');
        item.className = 'card mb-3';
        item.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${date}</h5>
                <p class="card-text">完成 ${completedDims.map(d => d.name).join('、')} 打卡</p>
                ${recordData[date] ? Object.entries(recordData[date]).map(([dimId, content]) => {
                    const dim = dimensions.find(d => d.id === dimId);
                    return dim ? `
                        <p class="mt-2"><strong>${dim.name}记录：</strong> ${content}</p>
                    ` : '';
                }).join('') : ''}
            </div>
        `;
        recentRecords.appendChild(item);
    });
}

// 维度管理相关函数
function showDimensionManager() {
    const dimensions = JSON.parse(localStorage.getItem('dimensions'));
    const dimensionList = document.getElementById('dimensionList');
    dimensionList.innerHTML = '';
    
    dimensions.forEach((dim, index) => {
        const dimensionDiv = document.createElement('div');
        dimensionDiv.className = 'card mb-3';
        dimensionDiv.innerHTML = `
            <div class="card-body">
                <div class="row g-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control dimension-name" 
                            value="${dim.name}" placeholder="维度名称">
                    </div>
                    <div class="col-md-6">
                        <input type="text" class="form-control dimension-desc" 
                            value="${dim.description}" placeholder="维度描述">
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-danger w-100" 
                            onclick="removeDimension(${index})">删除</button>
                    </div>
                </div>
            </div>
        `;
        dimensionList.appendChild(dimensionDiv);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('dimensionModal'));
    modal.show();
}

function addDimension() {
    const dimensionList = document.getElementById('dimensionList');
    const newDimension = document.createElement('div');
    newDimension.className = 'card mb-3';
    newDimension.innerHTML = `
        <div class="card-body">
            <div class="row g-3">
                <div class="col-md-4">
                    <input type="text" class="form-control dimension-name" 
                        placeholder="维度名称">
                </div>
                <div class="col-md-6">
                    <input type="text" class="form-control dimension-desc" 
                        placeholder="维度描述">
                </div>
                <div class="col-md-2">
                    <button class="btn btn-danger w-100" 
                        onclick="this.closest('.card').remove()">删除</button>
                </div>
            </div>
        </div>
    `;
    dimensionList.appendChild(newDimension);
}

function removeDimension(index) {
    const dimensions = JSON.parse(localStorage.getItem('dimensions'));
    if (dimensions.length <= 1) {
        alert('至少需要保留一个维度！');
        return;
    }
    document.querySelectorAll('#dimensionList .card')[index].remove();
}

function saveDimensions() {
    const cards = document.querySelectorAll('#dimensionList .card');
    const newDimensions = Array.from(cards).map((card, index) => ({
        id: `dim_${index}`,
        name: card.querySelector('.dimension-name').value,
        description: card.querySelector('.dimension-desc').value
    }));
    
    if (newDimensions.length === 0) {
        alert('至少需要一个维度！');
        return;
    }
    
    localStorage.setItem('dimensions', JSON.stringify(newDimensions));
    
    const oldCheckInData = JSON.parse(localStorage.getItem('checkInData'));
    const newCheckInData = {};
    newDimensions.forEach(dim => {
        newCheckInData[dim.id] = oldCheckInData[dim.id] || [];
    });
    localStorage.setItem('checkInData', JSON.stringify(newCheckInData));
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('dimensionModal'));
    modal.hide();
    updateDisplay();
}

// 鼓励语管理相关函数
function showEncouragementManager() {
    const encouragements = JSON.parse(localStorage.getItem('encouragements'));
    
    // 显示默认鼓励语
    const defaultList = document.getElementById('defaultEncouragements');
    defaultList.innerHTML = encouragements.default.map(text => `
        <div class="card mb-2">
            <div class="card-body">
                <p class="card-text">${text}</p>
                <span class="badge bg-secondary">默认</span>
            </div>
        </div>
    `).join('');
    
    // 显示自定义鼓励语
    const customList = document.getElementById('customEncouragements');
    customList.innerHTML = encouragements.custom.map((text, index) => `
        <div class="card mb-2">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <p class="card-text mb-0">${text}</p>
                    <button class="btn btn-sm btn-danger" 
                        onclick="removeEncouragement(${index})">删除</button>
                </div>
            </div>
        </div>
    `).join('');
    
    const modal = new bootstrap.Modal(document.getElementById('encouragementModal'));
    modal.show();
}

function addCustomEncouragement() {
    const text = prompt('请输入新的鼓励语：');
    if (text && text.trim()) {
        const encouragements = JSON.parse(localStorage.getItem('encouragements'));
        encouragements.custom.push(text.trim());
        localStorage.setItem('encouragements', JSON.stringify(encouragements));
        showEncouragementManager();
    }
}

function removeEncouragement(index) {
    const encouragements = JSON.parse(localStorage.getItem('encouragements'));
    encouragements.custom.splice(index, 1);
    localStorage.setItem('encouragements', JSON.stringify(encouragements));
    showEncouragementManager();
}

function saveEncouragements() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('encouragementModal'));
    modal.hide();
}