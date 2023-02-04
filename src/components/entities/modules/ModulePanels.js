import { useState } from 'react';
import Modal from '../../UI/Modal.js';
import API from '../../api/API.js';
import Panel from '../../UI/Panel.js';
import ObjectTable from '../../UI/ObjectTable.js';
import Action from '../../UI/Actions.js';
import ToolTipDecorator from '../../UI/ToolTipDecorator.js';
import ModuleForm from '../../entities/modules/ModuleForm.js';

export default function ModulePanels({ modules, reloadModules }) {
  // Initialisation ------------------------------
  const putModulesEndpoint = '/modules';
  const deleteModulesEndpoint = '/modules';

  // State ---------------------------------------
  const [showFormId, setShowFormId] = useState(0);

  // Context -------------------------------------
  const { handleModal } = Modal.useModal();

  // Methods -------------------------------------
  const toggleModify = (id) => setShowFormId(showFormId === id ? 0 : id);

  const handleDelete = async (id) => { 
    dismissModal();
    const response = await API.delete(`${deleteModulesEndpoint}/${id}`);
    response.isSuccess
      ? reloadModules()
      : showErrorModal("Delete failed!", response.message);
  }

  const handleSubmit = async (module) => {
    const response = await API.put(`${putModulesEndpoint}/${module.ModuleID}`, module);
    if (response.isSuccess) {
      setShowFormId(0);
      reloadModules();
    }
  }
  const handleCancel = () => setShowFormId(0);

  const showDeleteModal = (id) => handleModal({
    show: true,
    title: "Alert!",
    content: <p> Are you sure you want to delete this module?</p>,
    actions: [
      <ToolTipDecorator key="ActionYes" message="Click to confirm deletion">
        <Action.Yes showText onClick={() => handleDelete(id)} />
      </ToolTipDecorator>,
      <ToolTipDecorator key="ActionNo" message="Click to abandon deletion">
        <Action.No showText onClick={dismissModal} />
      </ToolTipDecorator>
    ]
  });

  const showErrorModal = (title,message) => handleModal({
    show: true,
    title: title,
    content: <p>{message}</p>,
    actions: [
      <ToolTipDecorator key="ActionClose" message="Click to dismiss error message">
        <Action.Close showText onClick={dismissModal} />
      </ToolTipDecorator>
    ]
  });

  const dismissModal = () => handleModal({ show: false });

  // View ----------------------------------------
  const displayableAttributes = [
    { key: 'ModuleLevel', label: 'Module level' },
    { key: 'ModuleYearName', label: 'Year taken' },
    { key: 'ModuleLeaderName', label: 'Module leader' }
  ];

  return (
    <Panel.Container>
      {
        modules.map((module) =>
          <Panel
            key={module.ModuleID}
            title={`${module.ModuleCode} ${module.ModuleName}`}
            level={3}
          >
            <Panel.Static level={4}>
              <ObjectTable object={module} attributes={displayableAttributes} />
            </Panel.Static>

            <Action.Tray>
              <ToolTipDecorator message="Modify this module">
                <Action.Modify showText onClick={() => toggleModify(module.ModuleID)} buttonText="Modify module"/>
              </ToolTipDecorator>
              <ToolTipDecorator message="Delete this module">
                <Action.Delete showText onClick={() => showDeleteModal(module.ModuleID)} buttonText="Delete module"/>
              </ToolTipDecorator>
            </Action.Tray>

            {
              (showFormId === module.ModuleID ) &&
                <ModuleForm initialModule={module} onCancel={handleCancel} onSubmit={handleSubmit} />
            }

          </Panel>
        )
      }
    </Panel.Container>
  );
}
