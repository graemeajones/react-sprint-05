import { useState } from 'react';
import API from '../../api/API.js';
import useLoad from '../../api/useLoad.js';
import Action from '../../UI/Actions.js';
import ToolTipDecorator from '../../UI/ToolTipDecorator.js';
import ModulePanels from './ModulePanels.js';
import ModuleForm from './ModuleForm.js';
import ModulememberForm from '../modulemembers/ModulememberForm.js';

export default function MyModules({loggedinUserID}) {
  // Initialisation ------------------------------
  const getModulesEndpoint = `/modules/users/${loggedinUserID}`;
  const postModulesEndpoint = '/modules';
  const postModulemembersEndpoint = '/modulemembers';

  // State ---------------------------------------
  const [modules, , loadingMessage, loadModules] = useLoad(getModulesEndpoint);
  const [showAddModuleForm, setShowAddModuleForm] = useState(false);
  const [showAddModulememberForm, setShowAddModulememberForm] = useState(false);

  // Context -------------------------------------
  // Methods -------------------------------------
  const toggleAddModuleForm = () => {
    setShowAddModulememberForm(false);
    setShowAddModuleForm(!showAddModuleForm);
  }
  const toggleAddModulememberForm = () => {
    setShowAddModuleForm(false);
    setShowAddModulememberForm(!showAddModulememberForm);
  }
  const cancelAddModuleForm = () => setShowAddModuleForm(false);
  const cancelAddModulememberForm = () => setShowAddModulememberForm(false);

  const handleAddModuleSubmit = async (module) => {
    const response = await API.post(postModulesEndpoint, module);
    return loadModules() && response.isSuccess; // REMOVE reload
  }

  const handleAddModulememberSubmit = async (modulemember) => {
    const response = await API.post(postModulemembersEndpoint, modulemember);
    return response.isSuccess
      ? loadModules() || true
      : false;
  }

  // View ----------------------------------------
  return (
    <>
      <h2>My Modules</h2>

      {
        !modules 
          ? <p>{loadingMessage}</p>
          : modules.length === 0
            ? <p>No modules found</p>
            : <ModulePanels modules={modules} reload={loadModules} />
      }

      <p>&nbsp;</p>
      
      <Action.Tray>
        <ToolTipDecorator message="Add new module">
          <Action.Add showText onClick={toggleAddModuleForm} buttonText="Add a new module"/>
        </ToolTipDecorator>
        <ToolTipDecorator message="Join a module">
          <Action.Add showText onClick={toggleAddModulememberForm} buttonText="Join a module"/>
        </ToolTipDecorator>
      </Action.Tray>

      {
        showAddModuleForm &&
          <ModuleForm onCancel={cancelAddModuleForm} onSubmit={handleAddModuleSubmit} />
      }
      {
        showAddModulememberForm &&
          <ModulememberForm onCancel={cancelAddModulememberForm} onSubmit={handleAddModulememberSubmit} />
      }

    </>
  );
}
