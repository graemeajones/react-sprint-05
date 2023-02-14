import { useState } from 'react';
import Modal from '../../UI/Modal.js';
import API from '../../api/API.js';
import Panel from '../../UI/Panel.js';
import ObjectTable from '../../UI/ObjectTable.js';
import Action from '../../UI/Actions.js';
import ToolTipDecorator from '../../UI/ToolTipDecorator.js';
import ProjectForm from '../projects/ProjectForm.js';

export default function ProjectPanels({ projects, reload }) {
  // Initialisation ------------------------------
  const putProjectsEndpoint = '/projects';
  const deleteProjectsEndpoint = '/projects';

  // State ---------------------------------------
  const [showFormId, setShowFormId] = useState(0);

  // Context -------------------------------------
  const { handleModal } = Modal.useModal();

  // Methods -------------------------------------
  const toggleModify = (id) => setShowFormId(showFormId === id ? 0 : id);

  const handleDelete = async (id) => { 
    dismissModal();
    const response = await API.delete(`${deleteProjectsEndpoint}/${id}`);
    response.isSuccess
      ? reload()
      : showErrorModal("Delete failed!", response.message);
  }

  const handleSubmit = async (project) => {
    const response = await API.put(`${putProjectsEndpoint}/${project.ProjectID}`, project);
    if (response.isSuccess) {
      setShowFormId(0);
      reload();
    }
  }
  const handleCancel = () => setShowFormId(0);

  const showDeleteModal = (id) => handleModal({
    show: true,
    title: "Alert!",
    content: <p> Are you sure you want to delete this project?</p>,
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
    { key: 'ProjectName', label: 'Project name' },
    { key: 'ProjectModuleName', label: 'Module name' },
    { key: 'ProjectStartdate', label: 'Project start date' },
    { key: 'ProjectGroupsize', label: 'Project group size' },
    { key: 'ProjectProjectstatusName', label: 'Project status' }
  ];

  return (
    <Panel.Container>
      {
        projects.map((project) =>
          <Panel
            key={project.ProjectID}
            title={`${project.ProjectName}`}
            level={3}
          >
            <Panel.Static level={4}>
              <ObjectTable object={project} attributes={displayableAttributes} />
            </Panel.Static>

            <Action.Tray>
              <ToolTipDecorator message="Modify this project">
                <Action.Modify showText onClick={() => toggleModify(project.ProjectID)} buttonText="Modify project"/>
              </ToolTipDecorator>
              <ToolTipDecorator message="Delete this project">
                <Action.Delete showText onClick={() => showDeleteModal(project.ProjectID)} buttonText="Delete project"/>
              </ToolTipDecorator>
            </Action.Tray>

            {
              (showFormId === project.ProjectID ) &&
                <ProjectForm initialRecord={project} onCancel={handleCancel} onSubmit={handleSubmit} />
            }

          </Panel>
        )
      }
    </Panel.Container>
  );
}
