import React, { useState } from 'react';
import './Dashboard.css';
import { Home, Calendar, Package, Gift, Map, User, Plus, X, Trash2 } from 'lucide-react';

let nextProjectId = 3;

const Dashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', category: '' });

  const [projects, setProjects] = useState([
    { id: 1, name: 'Planejar Um Evento', category: 'Planejamento', daysLeft: 32, progress: 26 },
    { id: 2, name: 'Devolver Um Pacote', category: 'Entrega', daysLeft: 4, progress: 74 },
  ]);

  const categories = [
    { icon: <Home size={20} />, title: 'Ajuda Doméstica', color: '#FFF4E5' },
    { icon: <Calendar size={20} />, title: 'Planejar um evento', color: '#E5F6FF' },
    { icon: <Package size={20} />, title: 'Devolver um pacote', color: '#E5FFF2' },
    { icon: <Gift size={20} />, title: 'Enviar um presente', color: '#F2E5FF' },
    { icon: <Calendar size={20} />, title: 'Agendar consulta', color: '#FFE5EC' },
    { icon: <Package size={20} />, title: 'Tirar passaporte', color: '#E5FAFF' },
    { icon: <User size={20} />, title: 'Atividade infantil', color: '#FFF9E5' },
    { icon: <Map size={20} />, title: 'Planejar uma viagem', color: '#F0FFE5' },
  ];

  const handleAddProject = () => {
    if (!newProject.name.trim()) return;
    setProjects(prev => [...prev, {
      id: nextProjectId++,
      name: newProject.name,
      category: newProject.category || 'Geral',
      daysLeft: 30,
      progress: 0,
    }]);
    setNewProject({ name: '', category: '' });
    setShowModal(false);
  };

  const handleDeleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="dashboard-container">
      <section className="recommended-section">
        <h2 className="section-title">Categorias Recomendadas</h2>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div key={index} className="category-card" style={{ '--bg-color': cat.color }}>
              <div className="category-icon">{cat.icon}</div>
              <span className="category-title">{cat.title}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="active-projects">
        <div className="section-header">
          <h2 className="section-title">Projetos Ativos</h2>
          <button className="new-project-btn-dash" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Novo Projeto
          </button>
        </div>
        
        <div className="project-list">
          {projects.map(project => (
            <div key={project.id} className="project-item">
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{project.category}</p>
              </div>
              <div className="project-meta">
                <span>⏳ {project.daysLeft} Dias restantes</span>
                <div className="progress-bar"><div className="progress" style={{ width: `${project.progress}%` }}></div></div>
                <button className="project-delete-btn" onClick={() => handleDeleteProject(project.id)}><Trash2 size={16} /></button>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="empty-text">Nenhum projeto ativo. Crie um novo projeto acima.</p>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Projeto</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <label className="form-label">Nome do Projeto</label>
              <input
                className="form-input"
                placeholder="Digite o nome do projeto..."
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                autoFocus
              />

              <label className="form-label">Categoria</label>
              <input
                className="form-input"
                placeholder="ex: Planejamento, Entrega..."
                value={newProject.category}
                onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
              />
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="modal-submit" onClick={handleAddProject}>Criar Projeto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
