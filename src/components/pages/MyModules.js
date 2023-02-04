import { useState } from 'react';
import { useAuth } from '../auth/useAuth.js';
import API from '../api/API.js';
import useLoad from '../api/useLoad.js';
import Action from '../UI/Actions.js';
import ToolTipDecorator from '../UI/ToolTipDecorator.js';
import ModulePanels from '../entities/modules/ModulePanels.js';
import ModuleForm from '../entities/modules/ModuleForm.js';
import JoinModuleForm from '../entities/modules/JoinModuleForm.js';
import './Pages.scss';

export default function MyModules() {
  // Initialisation ------------------------------
  const { loggedinUser } = useAuth();
  const getModulesEndpoint = `/modules/users/${loggedinUser.UserID}`;
  const postModulesEndpoint = '/modules';
  const postModulemembersEndpoint = '/modulemembers';

  // State ---------------------------------------
  const [modules, , loadingMessage, loadModules] = useLoad(getModulesEndpoint);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showJoinModuleForm, setShowJoinModuleForm] = useState(false);

  // Context -------------------------------------
  // Methods -------------------------------------
  const toggleAddForm = () => {
    setShowJoinModuleForm(false);
    setShowAddModuleForm(!showAddModuleForm);
  }
  const toggleJoinForm = () => {
    setShowAddModuleForm(false);
    setShowJoinModuleForm(!showJoinModuleForm);
  }
  const cancelAddForm = () => setShowAddModuleForm(false);
  const cancelJoinForm = () => setShowJoinModuleForm(false);

  const handleAddSubmit = async (module) => {
    const response = await API.post(postModulesEndpoint, module);
    return loadModules() && response.isSuccess; // REMOVE reload
  }

  const handleJoinSubmit = async (modulemember) => {
    const response = await API.post(postModulemembersEndpoint, modulemember);
    return response.isSuccess
      ? loadModules() || true
      : false;
  }

  // View ----------------------------------------
  return (
    <section>
      <h1>My Modules</h1>

      {
        !modules 
          ? <p>{loadingMessage}</p>
          : modules.length === 0
            ? <p>No modules found</p>
            : <ModulePanels modules={modules} reloadModules={loadModules} />
      }

      <p>&nbsp;</p>
      
      <Action.Tray>
        <ToolTipDecorator message="Add new module">
          <Action.Add showText onClick={toggleAddForm} buttonText="Add a new module"/>
        </ToolTipDecorator>
        <ToolTipDecorator message="Join a module">
          <Action.Add showText onClick={toggleJoinForm} buttonText="Join a module"/>
        </ToolTipDecorator>
      </Action.Tray>

      {
        showAddModuleForm && <ModuleForm onCancel={cancelAddForm} onSubmit={handleAddSubmit} />
      }
      {
        showJoinModuleForm && <JoinModuleForm onCancel={cancelJoinForm} onSubmit={handleJoinSubmit}/>
      }

    </section>
  );
}
