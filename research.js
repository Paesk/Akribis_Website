(() => {
  const root = document.getElementById('research');
  if (!root) return;

  const panelButtons = root.querySelectorAll('button[data-research-panel]');
  const panels = root.querySelectorAll('[data-research-content]');
  const status = root.querySelector('[data-research-status]');
  const panelStatuses = {
    calibration: '01 / Measured research result',
    welding: '02 / Practical demonstration',
    project: '03 / Our research question'
  };

  panelButtons.forEach((button) => button.addEventListener('click', () => {
    const selectedPanelId = button.getAttribute('aria-controls');
    panelButtons.forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
    panels.forEach((panel) => { panel.hidden = panel.id !== selectedPanelId; });
    status.textContent = panelStatuses[button.dataset.researchPanel];
  }));

  const calibrationButtons = root.querySelectorAll('button[data-calibrated]');
  const errorValue = root.querySelector('[data-error-value]');
  const errorBar = root.querySelector('[data-error-bar]');
  const errorResult = root.querySelector('[data-error-result]');
  const errorChart = root.querySelector('[data-error-chart]');

  calibrationButtons.forEach((button) => button.addEventListener('click', () => {
    const calibrated = button.dataset.calibrated === 'true';
    const value = calibrated ? 3.1 : 21;
    calibrationButtons.forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
    errorValue.textContent = String(value);
    errorBar.style.width = `${value / 21 * 100}%`;
    errorResult.textContent = calibrated
      ? 'Approximately 85% lower mean error'
      : 'Baseline before calibration';
    errorChart.setAttribute('aria-label', `21 millimetre baseline; selected mean absolute position error: ${value} millimetres`);
  }));

  const steps = root.querySelectorAll('button[data-research-step]');
  const stepDescription = root.querySelector('[data-research-step-description]');
  const descriptions = [
    'Measure the tool position relative to the workpiece and determine the errors under defined conditions.',
    'Coordinate sensing, actuation and control. Weight, correction range and response speed constrain the design.',
    'Compare the same movement with and without correction. Report speed, load and the error metric used for the comparison.'
  ];

  steps.forEach((button) => button.addEventListener('click', () => {
    steps.forEach((step) => step.setAttribute('aria-pressed', String(step === button)));
    stepDescription.textContent = descriptions[Number(button.dataset.researchStep)];
  }));
})();
