// Base de datos de prueba preestablecida para demostración inmediata
const MOCK_CASES = [
  {
    codigo: "CSA-F829",
    fecha: "01/06/2026",
    anonimo: true,
    afectadoNombre: "Estudiante de Básica",
    afectadoCurso: "6° Básico",
    acusadoNombre: "Compañeros de curso",
    acusadoRol: "Estudiante del mismo curso",
    tipos: ["Bullying / Acoso escolar repetido", "Discriminación o exclusión social"],
    fechaHecho: "2026-05-28",
    lugar: "Patio / Área de recreación",
    descripcion: "En los recreos un grupo de compañeros me deja fuera de los juegos y cuando me acerco se ríen y me dicen apodos. Esto ocurre casi todos los días y me da pena ir a clases.",
    frecuencia: "Ocurre con frecuencia (semanalmente)",
    riesgo: "Medio / Requiere atención rápida",
    testigos: "Otros compañeros del curso",
    solicitud: "Que hablen con el curso sobre el compañerismo y que detengan los apodos.",
    estado: "En análisis",
    respuesta: "Estimado/a estudiante: Hemos recibido tu denuncia. Iniciaremos una intervención grupal con la psicóloga en tu curso esta semana para tratar el tema del respeto y exclusión, sin revelar que tú hiciste esta denuncia para resguardar tu tranquilidad. Si te sientes mal en los recreos, recuerda que puedes acercarte a la oficina de Convivencia Escolar.",
    respuestaFecha: "02/06/2026"
  },
  {
    codigo: "CSA-A104",
    fecha: "30/05/2026",
    anonimo: false,
    studentNombre: "Sofía Andrade Miranda",
    studentCurso: "1° Medio",
    studentCorreo: "sofia.andrade@correo.cl",
    afectadoNombre: "Sofía Andrade Miranda",
    afectadoCurso: "1° Medio",
    acusadoNombre: "Usuario anónimo",
    acusadoRol: "No sé / Prefiero no decir",
    tipos: ["Ciberacoso (redes sociales, WhatsApp)"],
    fechaHecho: "2026-05-29",
    lugar: "En línea / Redes sociales",
    descripcion: "Crearon una cuenta de Instagram falsa usando fotos mías y suben memes ofensivos burlándose de mí. Varios alumnos del colegio siguen esa cuenta.",
    frecuencia: "Ha ocurrido un par de veces",
    riesgo: "Alto / Requiere atención urgente",
    testigos: "Amigas de mi curso que me enviaron las capturas",
    solicitud: "Que investiguen quién creó la cuenta y que nos ayuden a denunciarla en Instagram para que la borren.",
    estado: "Caso Cerrado",
    respuesta: "Estimada Sofía: Nos reunimos contigo y tu apoderado. Se activó el protocolo de ciberacoso, se envió el reporte oficial a la plataforma logrando la baja de la cuenta ofensiva y se realizó una charla de concientización digital con tu curso. Se mantendrá monitoreo de la situación.",
    respuestaFecha: "01/06/2026"
  },
  {
    codigo: "CSA-K981",
    fecha: "02/06/2026",
    anonimo: true,
    afectadoNombre: "Estudiante de Media",
    afectadoCurso: "3° Medio",
    acusadoNombre: "Estudiante de 4° Medio",
    acusadoRol: "Estudiante de otro curso",
    tipos: ["Amenazas o intimidación"],
    fechaHecho: "2026-06-02",
    lugar: "Fuera del establecimiento",
    descripcion: "Un estudiante de 4° medio me empujó a la salida del colegio y me amenazó con que me golpearía mañana si seguía juntándome con su grupo de amigos.",
    frecuencia: "Es la primera vez que ocurre",
    riesgo: "Alto / Requiere atención urgente",
    testigos: "Varios compañeros que estaban en el portón de salida",
    solicitud: "Que hablen con él para que me deje tranquilo.",
    estado: "Recibido",
    respuesta: "",
    respuestaFecha: ""
  }
];

// Carga inicial de datos
let appCases = [];

function loadDatabase() {
  const saved = localStorage.getItem("csa_denuncias");
  if (saved) {
    appCases = JSON.parse(saved);
  } else {
    // Si es la primera vez, cargar casos de prueba y guardarlos
    appCases = MOCK_CASES;
    localStorage.setItem("csa_denuncias", JSON.stringify(MOCK_CASES));
  }
}

// Inicializar base de datos al cargar el script
loadDatabase();

// -------------------------------------------------------------
// SISTEMA DE NAVEGACIÓN ENTRE VISTAS (TABS)
// -------------------------------------------------------------
function switchTab(tabId) {
  // Desactivar todas las secciones
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
  });

  // Activar la sección correspondiente
  const activeSec = document.getElementById(`sec-${tabId}`);
  if (activeSec) {
    activeSec.classList.add("active");
  }

  // Actualizar el estado de los enlaces en la barra de navegación
  document.querySelectorAll(".nav-link").forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("onclick").includes(tabId)) {
      link.classList.add("active");
    }
  });

  // Si entramos a la sección de administración, renderizar si ya está logueado
  if (tabId === 'admin') {
    checkAdminSession();
  }

  // Scroll al inicio
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle visual para opciones tipo tarjeta (Checkbox / Radio)
document.addEventListener("DOMContentLoaded", () => {
  // Event listener para las opciones de anonimato
  const radioAnonimo = document.querySelector('input[name="student-anonimo"][value="true"]');
  const radioIdentificado = document.querySelector('input[name="student-anonimo"][value="false"]');
  
  if (radioAnonimo && radioIdentificado) {
    radioAnonimo.addEventListener("change", () => {
      document.getElementById("opt-anonimo").classList.add("selected");
      document.getElementById("opt-identificado").classList.remove("selected");
    });
    radioIdentificado.addEventListener("change", () => {
      document.getElementById("opt-identificado").classList.add("selected");
      document.getElementById("opt-anonimo").classList.remove("selected");
    });
  }

  // Event listener para las checkboxes de tipo de situación
  document.querySelectorAll('#grp-tipos input[type="checkbox"]').forEach(chk => {
    chk.addEventListener("change", () => {
      chk.closest(".option-card").classList.toggle("selected", chk.checked);
      // Ocultar mensaje de error si selecciona uno
      if (chk.checked) {
        document.getElementById("err-tipos").style.display = "none";
      }
    });
  });
});

// Desplegar u ocultar el panel de identidad
function toggleIdentidad(isAnonimo) {
  const panel = document.getElementById("identidad-panel");
  if (isAnonimo) {
    panel.classList.remove("open");
  } else {
    panel.classList.add("open");
  }
}

// -------------------------------------------------------------
// PORTAL DE ESTUDIANTES: ENVÍO DE DENUNCIAS
// -------------------------------------------------------------

function validarFormulario() {
  let isValid = true;

  // Validar Afectado Nombre
  const afectadoInput = document.getElementById("afectado-nombre");
  const afectadoVal = afectadoInput.value.trim();
  const grpAfectado = document.getElementById("grp-afectado-nombre");
  if (!afectadoVal) {
    grpAfectado.classList.add("invalid");
    isValid = false;
  } else {
    grpAfectado.classList.remove("invalid");
  }

  // Validar Afectado Curso
  const cursoSelect = document.getElementById("afectado-curso");
  const cursoVal = cursoSelect.value;
  const grpCurso = document.getElementById("grp-afectado-curso");
  if (!cursoVal) {
    grpCurso.classList.add("invalid");
    isValid = false;
  } else {
    grpCurso.classList.remove("invalid");
  }

  // Validar al menos un Tipo de Situación
  const checkedTipos = document.querySelectorAll('input[name="situacion-tipo"]:checked');
  const errTipos = document.getElementById("err-tipos");
  if (checkedTipos.length === 0) {
    errTipos.style.display = "block";
    isValid = false;
  } else {
    errTipos.style.display = "none";
  }

  // Validar Descripción
  const descTextarea = document.getElementById("descripcion-hechos");
  const descVal = descTextarea.value.trim();
  const grpDesc = document.getElementById("grp-descripcion");
  if (!descVal) {
    grpDesc.classList.add("invalid");
    isValid = false;
  } else {
    grpDesc.classList.remove("invalid");
  }

  return isValid;
}

function submitDenuncia() {
  if (!validarFormulario()) {
    // Scroll al primer error
    const firstInvalid = document.querySelector(".form-group.invalid, #err-tipos[style*='block']");
    if (firstInvalid) {
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  // Obtener valores
  const isAnonimo = document.querySelector('input[name="student-anonimo"]:checked').value === "true";
  const studentNombre = document.getElementById("student-nombre").value.trim();
  const studentCurso = document.getElementById("student-curso").value.trim();
  const studentCorreo = document.getElementById("student-correo").value.trim();

  const afectadoNombre = document.getElementById("afectado-nombre").value.trim();
  const afectadoCurso = document.getElementById("afectado-curso").value;
  const acusadoNombre = document.getElementById("acusado-nombre").value.trim() || "No especificado";
  const acusadoRol = document.getElementById("acusado-rol").value || "No especificado";

  const tipos = Array.from(document.querySelectorAll('input[name="situacion-tipo"]:checked')).map(c => c.value);
  const fechaHecho = document.getElementById("fecha-hecho").value || "No indicada";
  const lugar = document.getElementById("lugar-hecho").value || "No especificado";
  const descripcion = document.getElementById("descripcion-hechos").value.trim();
  const frecuencia = document.getElementById("frecuencia-hecho").value || "No especificado";
  const riesgo = document.getElementById("riesgo-afectado").value;

  const testigos = document.getElementById("testigos-hechos").value.trim() || "No indicado";
  const solicitud = document.getElementById("expectativa-resolucion").value.trim() || "No especificado";

  // Generar código de seguimiento único: CSA + 4 caracteres aleatorios en mayúsculas
  const codeChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Evita O, I, 0, 1 para evitar confusión
  let randomCode = "";
  for (let i = 0; i < 4; i++) {
    randomCode += codeChars.charAt(Math.floor(Math.random() * codeChars.length));
  }
  const codigoUnico = `CSA-${randomCode}`;

  const fechaHoy = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Objeto de la denuncia
  const nuevaDenuncia = {
    codigo: codigoUnico,
    fecha: fechaHoy,
    anonimo: isAnonimo,
    studentNombre: isAnonimo ? "" : studentNombre,
    studentCurso: isAnonimo ? "" : studentCurso,
    studentCorreo: isAnonimo ? "" : studentCorreo,
    afectadoNombre,
    afectadoCurso,
    acusadoNombre,
    acusadoRol,
    tipos,
    fechaHecho,
    lugar,
    descripcion,
    frecuencia,
    riesgo,
    testigos,
    solicitud,
    estado: "Recibido",
    respuesta: "",
    respuestaFecha: ""
  };

  // Guardar en array y guardar en localstorage
  appCases.unshift(nuevaDenuncia);
  localStorage.setItem("csa_denuncias", JSON.stringify(appCases));

  // Mostrar código de éxito
  document.getElementById("display-tracking-code").innerText = codigoUnico;
  document.getElementById("form-container").style.display = "none";
  document.getElementById("success-container").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
  // Limpiar campos de texto
  document.querySelectorAll('input[type="text"], input[type="password"], textarea').forEach(el => el.value = "");
  document.querySelectorAll('select').forEach(el => el.selectedIndex = 0);
  
  // Limpiar checkboxes
  document.querySelectorAll('input[name="situacion-tipo"]').forEach(chk => {
    chk.checked = false;
    chk.closest(".option-card").classList.remove("selected");
  });

  // Re-establecer radios de anonimato
  document.querySelector('input[name="student-anonimo"][value="true"]').checked = true;
  document.getElementById("opt-anonimo").classList.add("selected");
  document.getElementById("opt-identificado").classList.remove("selected");
  document.getElementById("identidad-panel").classList.remove("open");

  // Ocultar mensajes de error
  document.querySelectorAll(".form-group").forEach(grp => grp.classList.remove("invalid"));
  document.getElementById("err-tipos").style.display = "none";

  // Volver a mostrar el formulario
  document.getElementById("success-container").style.display = "none";
  document.getElementById("form-container").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}


// -------------------------------------------------------------
// PORTAL DE ESTUDIANTES: SEGUIMIENTO DE CASOS
// -------------------------------------------------------------
function buscarSeguimiento() {
  const codeInput = document.getElementById("input-tracking-code").value.trim().toUpperCase();
  const errorMsg = document.getElementById("tracking-error");
  const resultBox = document.getElementById("tracking-results");

  if (!codeInput) return;

  // Buscar caso por código
  const caso = appCases.find(c => c.codigo === codeInput);

  if (!caso) {
    errorMsg.style.display = "block";
    resultBox.style.display = "none";
    return;
  }

  // Ocultar errores e inyectar datos del caso
  errorMsg.style.display = "none";
  resultBox.style.display = "block";

  document.getElementById("result-code").innerText = `CASO ${caso.codigo}`;
  document.getElementById("result-date").innerText = `Fecha de envío: ${caso.fecha}`;
  
  // Badge de Estado
  const statusBadge = document.getElementById("result-status");
  statusBadge.innerText = caso.estado;
  statusBadge.className = "badge"; // Limpiar clases anteriores
  if (caso.estado === "Recibido") statusBadge.classList.add("badge-recibido");
  else if (caso.estado === "En análisis") statusBadge.classList.add("badge-revision");
  else if (caso.estado === "Caso Cerrado") statusBadge.classList.add("badge-cerrado");

  // Involucrados
  document.getElementById("result-afectado").innerText = `${caso.afectadoNombre} (${caso.afectadoCurso})`;
  document.getElementById("result-tipo").innerText = caso.tipos.join(", ");
  document.getElementById("result-desc").innerText = caso.descripcion;

  // Respuesta del Encargado
  const replyBox = document.getElementById("result-reply-box");
  if (caso.respuesta) {
    replyBox.style.display = "block";
    document.getElementById("result-reply-date").innerText = caso.respuestaFecha;
    document.getElementById("result-reply-text").innerText = caso.respuesta;
  } else {
    // Si no hay respuesta del encargado
    replyBox.style.display = "block";
    document.getElementById("result-reply-date").innerText = "";
    document.getElementById("result-reply-text").innerHTML = "<i>Su caso ha sido recibido y está siendo evaluado confidencialmente por el Encargado de Convivencia Escolar. Aún no se ha registrado una respuesta formal. Por favor consulte más tarde.</i>";
  }

  resultBox.scrollIntoView({ behavior: "smooth", block: "center" });
}


// -------------------------------------------------------------
// PORTAL DE ADMINISTRACIÓN (LOGIN Y SESIÓN)
// -------------------------------------------------------------
let isAdminLoggedIn = false;
let selectedAdminCaseCode = null;

function checkAdminSession() {
  const loginView = document.getElementById("admin-login-view");
  const dashboardView = document.getElementById("admin-dashboard-view");

  if (isAdminLoggedIn) {
    loginView.style.display = "none";
    dashboardView.style.display = "block";
    renderAdminDashboard();
  } else {
    loginView.style.display = "block";
    dashboardView.style.display = "none";
    document.getElementById("admin-password").focus();
  }
}

function intentarLogin() {
  const passInput = document.getElementById("admin-password");
  const errorMsg = document.getElementById("login-error");

  // Contraseña fija para el demo
  if (passInput.value === "admin123") {
    isAdminLoggedIn = true;
    errorMsg.style.display = "none";
    passInput.value = "";
    checkAdminSession();
  } else {
    errorMsg.style.display = "block";
    passInput.value = "";
    passInput.focus();
  }
}

function handleLoginKeyPress(event) {
  if (event.key === "Enter") {
    intentarLogin();
  }
}

function logoutAdmin() {
  isAdminLoggedIn = false;
  selectedAdminCaseCode = null;
  checkAdminSession();
}

// -------------------------------------------------------------
// PORTAL DE ADMINISTRACIÓN: CONTROL DE DASHBOARD
// -------------------------------------------------------------
function renderAdminDashboard() {
  // Recargar datos desde localStorage por si hubo cambios
  loadDatabase();

  // Calcular estadísticas
  const total = appCases.length;
  const pendientes = appCases.filter(c => c.estado !== "Caso Cerrado").length;
  const resueltos = appCases.filter(c => c.estado === "Caso Cerrado").length;

  document.getElementById("stat-totales").innerText = total;
  document.getElementById("stat-pendientes").innerText = pendientes;
  document.getElementById("stat-resueltos").innerText = resueltos;

  // Renderizar la lista de casos en la barra lateral
  const listContainer = document.getElementById("admin-cases-container");
  listContainer.innerHTML = "";

  if (appCases.length === 0) {
    listContainer.innerHTML = `
      <div class="admin-no-case" style="min-height:200px;">
        <span>📂</span>
        <p style="font-size:0.85rem;">No hay denuncias registradas.</p>
      </div>
    `;
    return;
  }

  appCases.forEach(caso => {
    const isSelected = caso.codigo === selectedAdminCaseCode;
    const btn = document.createElement("button");
    btn.className = `case-item-btn ${isSelected ? 'active' : ''}`;
    btn.onclick = () => seleccionarCasoAdmin(caso.codigo);

    // Determinar badge de estado rápido
    let statusClass = "badge-recibido";
    if (caso.estado === "En análisis") statusClass = "badge-revision";
    else if (caso.estado === "Caso Cerrado") statusClass = "badge-cerrado";

    // Determinar nivel de riesgo rápido
    let riskBadgeClass = "badge-riesgo-bajo";
    if (caso.riesgo.includes("Medio")) riskBadgeClass = "badge-riesgo-medio";
    else if (caso.riesgo.includes("Alto")) riskBadgeClass = "badge-riesgo-alto";

    btn.innerHTML = `
      <div class="case-item-header">
        <span class="case-item-code">${caso.codigo}</span>
        <span class="case-item-date">${caso.fecha}</span>
      </div>
      <div class="case-item-desc">${caso.afectadoNombre} (${caso.afectadoCurso})</div>
      <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:2px;">
        <span class="badge ${statusClass}" style="font-size:0.65rem; padding:2px 6px;">${caso.estado}</span>
        <span class="badge ${riskBadgeClass}" style="font-size:0.65rem; padding:2px 6px;">Riesgo ${caso.riesgo.split(" / ")[0]}</span>
      </div>
    `;
    listContainer.appendChild(btn);
  });

  // Actualizar el detalle derecho
  renderDetalleCasoAdmin();
}

function seleccionarCasoAdmin(codigo) {
  selectedAdminCaseCode = codigo;
  renderAdminDashboard();
}

function renderDetalleCasoAdmin() {
  const detailContainer = document.getElementById("admin-detail-container");

  if (!selectedAdminCaseCode) {
    detailContainer.innerHTML = `
      <div class="admin-no-case">
        <span>👈</span>
        <h3>Selecciona un caso</h3>
        <p>Haz clic en uno de los casos del panel de la izquierda para ver su contenido y gestionarlo.</p>
      </div>
    `;
    return;
  }

  const caso = appCases.find(c => c.codigo === selectedAdminCaseCode);
  if (!caso) {
    selectedAdminCaseCode = null;
    renderDetalleCasoAdmin();
    return;
  }

  // Determinar clases de badges
  let statusBadgeClass = "badge-recibido";
  if (caso.estado === "En análisis") statusBadgeClass = "badge-revision";
  else if (caso.estado === "Caso Cerrado") statusBadgeClass = "badge-cerrado";

  let riskBadgeClass = "badge-riesgo-bajo";
  if (caso.riesgo.includes("Medio")) riskBadgeClass = "badge-riesgo-medio";
  else if (caso.riesgo.includes("Alto")) riskBadgeClass = "badge-riesgo-alto";

  // Datos del denunciante
  let denuncianteInfo = "Anónimo (Confidencial)";
  if (!caso.anonimo) {
    denuncianteInfo = `
      <strong>Nombre:</strong> ${caso.studentNombre}<br>
      <strong>Curso:</strong> ${caso.studentCurso || "No indicado"}<br>
      <strong>Correo:</strong> ${caso.studentCorreo ? `<a href="mailto:${caso.studentCorreo}">${caso.studentCorreo}</a>` : "No indicado"}
    `;
  }

  detailContainer.innerHTML = `
    <div class="detail-header">
      <div>
        <span class="detail-code">${caso.codigo}</span>
        <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Recibido el ${caso.fecha}</div>
      </div>
      <div style="display:flex; gap:8px;">
        <span class="badge ${statusBadgeClass}">${caso.estado}</span>
        <span class="badge ${riskBadgeClass}">Riesgo ${caso.riesgo.split(" / ")[0]}</span>
      </div>
    </div>

    <div class="detail-grid">
      <div class="detail-block">
        <h4>Denunciante (Origen)</h4>
        <p>${denuncianteInfo}</p>
      </div>
      <div class="detail-block">
        <h4>Persona Afectada</h4>
        <p><strong>Nombre:</strong> ${caso.afectadoNombre}<br><strong>Curso:</strong> ${caso.afectadoCurso}</p>
      </div>
      
      <div class="detail-block">
        <h4>Persona Acusada</h4>
        <p><strong>Nombre:</strong> ${caso.acusadoNombre}<br><strong>Relación:</strong> ${caso.acusadoRol}</p>
      </div>
      <div class="detail-block">
        <h4>Ubicación y Frecuencia</h4>
        <p><strong>Lugar:</strong> ${caso.lugar}<br><strong>Frecuencia:</strong> ${caso.frecuencia}</p>
      </div>

      <div class="detail-block" style="grid-column: 1 / -1;">
        <h4>Tipos de Situación reportada</h4>
        <p style="font-weight:600; color:var(--primary); font-size:0.9rem;">${caso.tipos.join(" | ")}</p>
      </div>

      <div class="detail-block full">
        <h4>Descripción de los hechos</h4>
        <p>${caso.descripcion}</p>
      </div>

      <div class="detail-block">
        <h4>Fecha del Suceso</h4>
        <p>${caso.fechaHecho}</p>
      </div>
      <div class="detail-block">
        <h4>Testigos identificados</h4>
        <p>${caso.testigos}</p>
      </div>

      <div class="detail-block full">
        <h4>Expectativa de resolución / Ayuda</h4>
        <p style="font-style:italic;">"${caso.solicitud}"</p>
      </div>
    </div>

    <!-- PANEL DE ACCIONES -->
    <div class="admin-actions-card">
      <h3>Acciones y Respuestas de Convivencia Escolar</h3>
      
      <div class="form-row" style="margin-bottom:16px;">
        <div class="form-group">
          <label for="update-status">Cambiar Estado del Caso</label>
          <select id="update-status">
            <option value="Recibido" ${caso.estado === "Recibido" ? "selected" : ""}>Recibido</option>
            <option value="En análisis" ${caso.estado === "En análisis" ? "selected" : ""}>En análisis (Revisión)</option>
            <option value="Caso Cerrado" ${caso.estado === "Caso Cerrado" ? "selected" : ""}>Caso Cerrado (Resuelto)</option>
          </select>
        </div>
      </div>

      <div class="form-row full" style="margin-bottom:16px;">
        <div class="form-group">
          <label for="update-reply">Mensaje/Respuesta para el Estudiante <span class="opc">(Visible con el código de seguimiento)</span></label>
          <textarea id="update-reply" rows="4" placeholder="Escribe aquí las medidas tomadas o instrucciones para el denunciante...">${caso.respuesta}</textarea>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <button class="btn btn-primary" onclick="guardarCambiosCasoAdmin('${caso.codigo}')">
          💾 Guardar Cambios y Responder
        </button>
        <button class="btn btn-danger" style="padding:10px 16px; font-size:0.85rem;" onclick="eliminarCasoAdmin('${caso.codigo}')">
          🗑️ Eliminar Caso
        </button>
      </div>
    </div>
  `;
}

function guardarCambiosCasoAdmin(codigo) {
  const newStatus = document.getElementById("update-status").value;
  const newReply = document.getElementById("update-reply").value.trim();

  const caso = appCases.find(c => c.codigo === codigo);
  if (!caso) return;

  const fechaHoy = new Date().toLocaleDateString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Actualizar caso
  caso.estado = newStatus;
  caso.respuesta = newReply;
  caso.respuestaFecha = newReply ? fechaHoy : "";

  // Guardar en localStorage
  localStorage.setItem("csa_denuncias", JSON.stringify(appCases));

  alert(`El caso ${codigo} ha sido actualizado correctamente.`);
  renderAdminDashboard();
}

function eliminarCasoAdmin(codigo) {
  if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente el caso ${codigo}? Esta acción no se puede deshacer.`)) {
    return;
  }

  // Filtrar
  appCases = appCases.filter(c => c.codigo !== codigo);
  localStorage.setItem("csa_denuncias", JSON.stringify(appCases));

  selectedAdminCaseCode = null;
  renderAdminDashboard();
}
