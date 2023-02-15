import useLoad from '../../api/useLoad.js';
import Form from '../../UI/Form.js';

const emptyRecord = {
  ProjectName: "Dummy project name",
  ProjectGroupsize: 5,
  ProjectStartdate: new Date(),
  ProjectProjectstatusID: 1,
  ProjectModuleID: null
};

export default function ProjectForm({ onCancel, onSubmit, initialRecord = emptyRecord }) {
  // Initialisation ------------------------------
  const validation = {
    isValid: {
      ProjectName: (name) => name.length > 8,
      ProjectGroupsize: (size) => (size > 1),
      ProjectStartdate: (date) => date.getTime() > (new Date()).getTime(),
      ProjectProjectstatusID: (id) => id > 0, 
      ProjectModuleID: (id) => (id === null) || (id > 0)
    },
    errorMessage: {
      ProjectName: "Project name is too short",
      ProjectGroupsize: "Any group size must be greater than one!",
      ProjectStartdate: "Selected date must be in the future",
      ProjectProjectstatusID: "Invalid project status type",
      ProjectModuleID: "Invalid module"
    }
  };

  const conformance = {
    js2html: {
      ProjectName: (name) => name,
      ProjectGroupsize: (size) => size,
      ProjectStartdate: (date) => date.toISOString().slice(0,10),
      ProjectProjectstatusID: (id) => id === null ? 0 : id,
      ProjectModuleID: (id) => id === null ? 0 : id
    },
    html2js: {
      ProjectName: (name) => name,
      ProjectGroupsize: (size) => size,
      ProjectStartdate: (date) => new Date(date),
      ProjectProjectstatusID: (id) => parseInt(id) === 0 ? null : parseInt(id),
      ProjectModuleID: (id) => parseInt(id) === 0 ? null : parseInt(id)
    }
  };

  // State ---------------------------------------
  const [project, errors, handleChange, handleSubmit] = Form.useForm(initialRecord, conformance, validation, onCancel, onSubmit);
  const [projectstatuses, , loadingStatusMessage,] = useLoad('/projectstatus');
  const [modules, , loadingModulesMessage,] = useLoad('/modules');

  // Handlers ------------------------------------
  // View ----------------------------------------
  return (
    <Form onSubmit={handleSubmit} onCancel={onCancel}>

      <Form.Item
        label="Project name"
        htmlFor="ProjectName"
        advice="Please enter the name of the project"
        error={errors.ProjectName}
      >
        <input
          type="text"
          name="ProjectName" 
          value={conformance.js2html['ProjectName'](project.ProjectName)}
          onChange={handleChange}
        />
      </Form.Item>
      
      <Form.Item
        label="Group size"
        htmlFor="ProjectGroupsize"
        advice="Choose a level between 3 and 7 inclusive"
        error={errors.ProjectGroupsize}
      >
        <input
          type="number"
          name="ProjectGroupsize" 
          value={conformance.js2html['ProjectGroupsize'](project.ProjectGroupsize)}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Project start date"
        htmlFor="ProjectStartdate"
        advice={'Select a start date in the future'}
        error={errors.ProjectStartdate}
      >
        <input
          type="date"
          name="ProjectStartdate"
          value={conformance.js2html['ProjectStartdate'](project.ProjectStartdate)}
          onChange={handleChange}
        />
      </Form.Item>

      <Form.Item
        label="Project module"
        htmlFor="ProjectModuleID"
        advice="Select the module running this project"
        error={errors.ProjectModuleID}
      >
        {
          !modules
            ? <p>{loadingModulesMessage}</p>
            : modules.length === 0
              ? <p>No records found</p>
              : <select
                  name="ProjectModuleID"
                  value={conformance.js2html['ProjectModuleID'](project.ProjectModuleID)}
                  onChange={handleChange}
                >
                  <option value="0">None selected</option>
                  {
                    modules.map((module) => <option key={module.ModuleID} value={module.ModuleID}>{module.ModuleName}</option>)
                  }
                </select>
        }
      </Form.Item>

      <Form.Item
        label="Status of project"
        htmlFor="ProjectProjectstatusID"
        advice="Select the status of the project"
        error={errors.ProjectProjectstatusID}
      >
        {
          !projectstatuses
            ? <p>{loadingStatusMessage}</p>
            : projectstatuses.length === 0
              ? <p>No records found</p>
              : <select
                  name="ProjectProjectstatusID"
                  value={conformance.js2html['ProjectProjectstatusID'](project.ProjectProjectstatusID)}
                  onChange={handleChange}
                >
                  <option value="0" disabled>None selected</option>
                  {
                    projectstatuses.map((status) => <option key={status.ProjectstatusID} value={status.ProjectstatusID}>{status.ProjectstatusName}</option>)
                  }
                </select>
        }
      </Form.Item>
     
    </Form>
  );
}
