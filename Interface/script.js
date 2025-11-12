document.addEventListener('DOMContentLoaded', () => {
    // ---- Funções de Atualização Simulada ----
    function updateMonitor(frascoId, ph, temp, heater, stirrer, pumpAcid, pumpBase) {
        const frascoElement = document.getElementById(frascoId);
        if (!frascoElement) return;

        frascoElement.querySelector(`#ph${frascoId.replace('frasco', '')}`).textContent = ph.toFixed(2);
        frascoElement.querySelector(`#temp${frascoId.replace('frasco', '')}`).textContent = temp.toFixed(1);

        const heaterStatus = frascoElement.querySelector(`#heater${frascoId.replace('frasco', '')}`);
        heaterStatus.textContent = heater ? 'Ligado' : 'Desligado';
        heaterStatus.className = heater ? 'status-on' : 'status-off';

        const stirrerStatus = frascoElement.querySelector(`#stirrer${frascoId.replace('frasco', '')}`);
        stirrerStatus.textContent = stirrer ? 'Ligado' : 'Desligado';
        stirrerStatus.className = stirrer ? 'status-on' : 'status-off';

        if (pumpAcid !== undefined) {
            const pumpAcidStatus = frascoElement.querySelector(`#pumpAcid${frascoId.replace('frasco', '')}`);
            pumpAcidStatus.textContent = pumpAcid ? 'Ligada' : 'Desligada';
            pumpAcidStatus.className = pumpAcid ? 'status-on' : 'status-off';
        }
        if (pumpBase !== undefined) {
            const pumpBaseStatus = frascoElement.querySelector(`#pumpBase${frascoId.replace('frasco', '')}`);
            pumpBaseStatus.textContent = pumpBase ? 'Ligada' : 'Desligada';
            pumpBaseStatus.className = pumpBase ? 'status-on' : 'status-off';
        }
    }

    function updateGeneralStatus(expName, status, phase, phaseTime, totalTime) {
        document.getElementById('expName').textContent = expName;
        document.getElementById('systemStatus').textContent = status;
        document.getElementById('systemStatus').className = `status-${status.toLowerCase().replace(' ', '-')}`;
        document.getElementById('currentPhase').textContent = phase;
        document.getElementById('phaseTime').textContent = phaseTime;
        document.getElementById('totalTime').textContent = totalTime;
    }

    function updateReservoirs(acid, base, enzymes) {
        document.getElementById('resAcid').textContent = `${acid}%`;
        document.getElementById('resBase').textContent = `${base}%`;
        document.getElementById('resEnzymes').textContent = `${enzymes}%`;
    }

    // ---- Simulação de dados em tempo real (para testes sem ESP32) ----
    let simulatedTime = 0;
    setInterval(() => {
        simulatedTime++;
        const totalMinutes = Math.floor(simulatedTime / 60);
        const totalSeconds = simulatedTime % 60;
        const totalTimeStr = `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}:${String(totalSeconds).padStart(2, '0')}`;

        const phEstomago = 7.0 - (simulatedTime / 60) * 0.1; // Simula queda de pH
        const phIntestino = 6.8 + Math.sin(simulatedTime / 100) * 0.1; // Simula pequenas variações

        updateGeneralStatus(
            'Degradação Plástico',
            simulatedTime < 10 ? 'Iniciando' : 'Rodando',
            simulatedTime < 60 ? 'Fase Oral' : (simulatedTime < 3600 ? 'Fase Gástrica' : 'Fase Intestinal'),
            '00:00:00', // Manter fixo para simplificar a simulação de fase
            totalTimeStr
        );

        updateMonitor(
            'frascoEstomago',
            Math.max(2.0, phEstomago), // pH não vai abaixo de 2.0
            37.0 + Math.random() * 0.2 - 0.1, // Pequena variação de temperatura
            true, true, true, undefined // Aquecedor, agitador, bomba ácido ligada
        );

        updateMonitor(
            'frascoIntestino',
            Math.max(6.5, phIntestino), // pH não vai abaixo de 6.5
            37.0 + Math.random() * 0.2 - 0.1,
            true, true, undefined, true // Aquecedor, agitador, bomba base ligada
        );

        updateReservoirs(
            Math.max(0, 100 - (simulatedTime / 300)), // Simula consumo lento
            Math.max(0, 100 - (simulatedTime / 250)),
            Math.max(0, 100 - (simulatedTime / 500))
        );

    }, 1000); // Atualiza a cada 1 segundo

    // ---- Lógica de Botões (Simulada por enquanto) ----
    document.getElementById('btnStart').addEventListener('click', () => {
        alert('Comando: Iniciar Experimento');
        // Aqui, no futuro, você faria uma requisição AJAX para o ESP32
    });

    document.getElementById('btnPause').addEventListener('click', () => {
        alert('Comando: Pausar Experimento');
    });

    document.getElementById('btnStop').addEventListener('click', () => {
        alert('Comando: Parar Emergência!');
    });

    document.querySelectorAll('.btn-update').forEach(button => {
        button.addEventListener('click', (event) => {
            const frasco = event.target.dataset.frasco;
            const setPh = document.getElementById(`setPh${frasco.charAt(0).toUpperCase() + frasco.slice(1)}`).value;
            const setTemp = document.getElementById(`setTemp${frasco.charAt(0).toUpperCase() + frasco.slice(1)}`).value;
            alert(`Comando: Atualizar Setpoints para ${frasco.toUpperCase()} - pH: ${setPh}, Temp: ${setTemp}`);
            // Futuramente, requisição AJAX para o ESP32
        });
    });

});