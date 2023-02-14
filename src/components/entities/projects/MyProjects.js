import { useState } from 'react';
import API from '../../api/API.js';
import useLoad from '../../api/useLoad.js';
import Action from '../../UI/Actions.js';
import ToolTipDecorator from '../../UI/ToolTipDecorator.js';
import ProjectPanels from './ProjectPanels.js';
import ProjectForm from './ProjectForm.js';

export default function MyProjects({loggedinUserID}) {
  // Initialisation ------------------------------
  const getProjectsEndpoint = `/projects`; //users/${loggedinUserID}`;
  const postProjectsEndpoint = '/projects';

  // State ---------------------------------------
  const [projects, , loadingMessage, loadProjects] = useLoad(getProjectsEndpoint);
  const [showAddForm, setShowAddForm] = useState(false);

  // Context -------------------------------------
  // Methods -------------------------------------
  const toggleAddForm = () => setShowAddForm(!showAddForm);
  const cancelAddForm = () => setShowAddForm(false);

  const handleAddSubmit = async (project) => {
    console.log('handleAddSubmit');
    const response = await API.post(postProjectsEndpoint, project);
    return loadProjects() && response.isSuccess; 
  }

  // View ----------------------------------------
  return (
    <section>
      <h2>My Projects</h2>

      {
        !projects 
          ? <p>{loadingMessage}</p>
          : projects.length === 0
            ? <p>No projects found</p>
            : <ProjectPanels projects={projects} reload={loadProjects} />
      }

      <p>&nbsp;</p>
      
      <Action.Tray>
        <ToolTipDecorator message="Add new project">
          <Action.Add showText onClick={toggleAddForm} buttonText="Add a new project"/>
        </ToolTipDecorator>
      </Action.Tray>

      {
        showAddForm && <ProjectForm onCancel={cancelAddForm} onSubmit={handleAddSubmit} />
      }

    </section>
  );
}
