import React, { useState } from 'react';
import './MyTasks.css';
import { List, Layout as KanbanIcon, Plus, Filter, SortAsc, EyeOff, MoreHorizontal, X, GripVertical, Trash2, Edit3, Check, Columns } from 'lucide-react';

let nextId = 4;
let nextColId = 4;

const MyTasks = () => {
  const [view, setView] = useState('list');
  const [showModal, setShowModal] = useState(false);
  const [modalColumnId, setModalColumnId] = useState(null);

  const [columns, setColumns] = useState([
    { id: 1, name: 'A FAZER' },
    { id: 2, name: 'Em Progresso' },
    { id: 3, name: 'Em Revisão' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Agendar Consulta Com Meu Endocrinologista...', category: 'Consulta', columnId: 3, priority: 'Alta', timeLeft: '15 Dias restantes', progress: 0 },
    { id: 2, title: 'Rastrear Entrega de Remédio', category: 'Rastreamento', columnId: 1, priority: 'Média', timeLeft: '12 Dias restantes', progress: 0 },
    { id: 3, title: 'Planejar Um Evento', category: 'Planejamento', columnId: 2, priority: 'Média', timeLeft: '32 Dias restantes', progress: 26 },
  ]);

  const [newTask, setNewTask] = useState({ title: '', category: '', priority: 'Medium' });
  const [editingColId, setEditingColId] = useState(null);
  const [editingColName, setEditingColName] = useState('');

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  // ---- CRUD ----
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const targetCol = modalColumnId || columns[0]?.id || 1;
    setTasks(prev => [...prev, {
      id: nextId++,
      title: newTask.title,
      category: newTask.category || 'General',
      columnId: targetCol,
      priority: newTask.priority,
      timeLeft: '30 Dias restantes',
      progress: 0,
    }]);
    setNewTask({ title: '', category: '', priority: 'Medium' });
    setShowModal(false);
    setModalColumnId(null);
  };

  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // ---- Column management ----
  const addColumn = () => {
    setColumns(prev => [...prev, { id: nextColId++, name: 'Nova Coluna' }]);
  };

  const deleteColumn = (colId) => {
    setColumns(prev => prev.filter(c => c.id !== colId));
    setTasks(prev => prev.filter(t => t.columnId !== colId));
  };

  const startEditColumn = (col) => {
    setEditingColId(col.id);
    setEditingColName(col.name);
  };

  const saveColumnName = () => {
    setColumns(prev => prev.map(c => c.id === editingColId ? { ...c, name: editingColName } : c));
    setEditingColId(null);
  };

  // ---- Drag & Drop ----
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', String(taskId));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('text/plain'), 10);
    if (isNaN(taskId)) return;
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, columnId: colId } : t));
    setDraggedTaskId(null);
  };

  const getColumnName = (colId) => {
    const col = columns.find(c => c.id === colId);
    return col ? col.name : 'Unknown';
  };

  const openModalForColumn = (colId) => {
    setModalColumnId(colId);
    setShowModal(true);
  };

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <h1 className="page-title">Minhas Tarefas</h1>
        <div className="view-switcher">
          <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>
            <List size={18} /><span>Lista</span>
          </button>
          <button className={`view-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>
            <KanbanIcon size={18} /><span>Kanban</span>
          </button>
        </div>
      </div>

      <div className="tasks-toolbar">
        <div className="toolbar-left">
          <button className="tool-btn"><Filter size={16} /> Filtrar</button>
          <button className="tool-btn"><SortAsc size={16} /> Ordenar</button>
          <button className="tool-btn"><EyeOff size={16} /> Ocultar</button>
          <button className="tool-btn"><MoreHorizontal size={16} /></button>
        </div>
        <button className="new-project-btn" onClick={() => { setModalColumnId(null); setShowModal(true); }}>
          <Plus size={18} /> Nova Tarefa
        </button>
      </div>

      {/* ===== LIST VIEW ===== */}
      {view === 'list' ? (
        <div className="list-view">
          {columns.map(col => {
            const colTasks = tasks.filter(t => t.columnId === col.id);
            if (colTasks.length === 0 && view === 'list') return null;
            return (
              <div 
                key={col.id} 
                className={`list-section ${draggedTaskId !== null ? 'drop-target' : ''}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <h3 className="list-section-title">{col.name} <span className="task-count">{colTasks.length}</span></h3>
                <div className="task-list">
                  {colTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`task-row ${draggedTaskId === task.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="task-main">
                        <h4 className="task-title">{task.title}</h4>
                        <span className="task-category">{task.category}</span>
                      </div>
                      <div className="task-details">
                        <span className={`badge status-badge`}>{getColumnName(task.columnId)}</span>
                        <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                        <span className="time-left">🕒 {task.timeLeft}</span>
                        <div className="task-progress">
                          <div className="progress-bar"><div className="progress" style={{ width: `${task.progress}%` }}></div></div>
                          <span className="progress-text">{task.progress}%</span>
                        </div>
                        <button className="more-btn" onClick={() => handleDeleteTask(task.id)} title="Excluir tarefa"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  <button className="add-task-inline" onClick={() => openModalForColumn(col.id)}><Plus size={16} /> Adicionar Nova Tarefa</button>
                </div>
              </div>
            );
          })}

          {/* Also show tasks with no column match */}
          {tasks.filter(t => !columns.find(c => c.id === t.columnId)).length > 0 && (
            <div className="list-section">
              <h3 className="list-section-title">Sem Categoria</h3>
              <div className="task-list">
                {tasks.filter(t => !columns.find(c => c.id === t.columnId)).map(task => (
                  <div key={task.id} className="task-row">
                    <div className="task-main">
                      <h4 className="task-title">{task.title}</h4>
                      <span className="task-category">{task.category}</span>
                    </div>
                    <div className="task-details">
                      <button className="more-btn" onClick={() => handleDeleteTask(task.id)} title="Delete task"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (

      /* ===== KANBAN VIEW ===== */
        <div className="kanban-view">
          {columns.map(col => (
            <div
              key={col.id}
              className={`kanban-column ${draggedTaskId !== null ? 'drop-target' : ''}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className="column-header">
                {editingColId === col.id ? (
                  <div className="col-edit-row">
                    <input
                      className="col-name-input"
                      value={editingColName}
                      onChange={(e) => setEditingColName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveColumnName()}
                      autoFocus
                    />
                    <button className="col-action-btn" onClick={saveColumnName}><Check size={14} /></button>
                  </div>
                ) : (
                  <>
                    <h3 className="column-title">
                      {col.name}
                      <span className="col-count">{tasks.filter(t => t.columnId === col.id).length}</span>
                    </h3>
                    <div className="col-actions">
                      <button className="col-action-btn" onClick={() => startEditColumn(col)} title="Renomear"><Edit3 size={14} /></button>
                      <button className="col-action-btn col-delete-btn" onClick={() => deleteColumn(col.id)} title="Excluir coluna"><Trash2 size={14} /></button>
                    </div>
                  </>
                )}
              </div>

              <div className="kanban-tasks" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, col.id)}>
                {tasks.filter(t => t.columnId === col.id).map(task => (
                  <div
                    key={task.id}
                    className={`kanban-card ${draggedTaskId === task.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="card-top">
                      <GripVertical size={14} className="grip-icon" />
                      <button className="card-delete-btn" onClick={() => handleDeleteTask(task.id)}><Trash2 size={14} /></button>
                    </div>
                    <h4 className="task-title">{task.title}</h4>
                    <p className="card-category">{task.category}</p>
                    <div className="card-footer">
                      <span className={`badge priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      <span className="time-left">🕒 {task.timeLeft}</span>
                    </div>
                  </div>
                ))}
                <button className="add-card-btn" onClick={() => openModalForColumn(col.id)}><Plus size={16} /> Adicionar Tarefa</button>
              </div>
            </div>
          ))}

          {/* Add Column button */}
          <button className="add-column-btn" onClick={addColumn}>
            <Columns size={18} />
            <span>Adicionar Coluna</span>
          </button>
        </div>
      )}

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalColumnId ? 'Nova Tarefa' : 'Novo Projeto'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <label className="form-label">Título da Tarefa</label>
              <input
                className="form-input"
                placeholder="Digite o título da tarefa..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                autoFocus
              />

              <label className="form-label">Categoria</label>
              <input
                className="form-input"
                placeholder="ex: Planejamento, Rastreamento..."
                value={newTask.category}
                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              />

              <label className="form-label">Prioridade</label>
              <select
                className="form-select"
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Low">Baixa</option>
                <option value="Medium">Média</option>
                <option value="High">Alta</option>
              </select>

              <label className="form-label">Coluna</label>
              <select
                className="form-select"
                value={modalColumnId || columns[0]?.id || ''}
                onChange={(e) => setModalColumnId(Number(e.target.value))}
              >
                {columns.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="modal-submit" onClick={handleAddTask}>Criar Tarefa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;
