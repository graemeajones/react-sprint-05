import { useAuth } from '../auth/useAuth.js';
import Panel from '../UI/Panel.js';
import MyModules from '../entities/modules/MyModules.js';
import MyProjects from '../entities/projects/MyProjects.js';
import './Page.scss';

export default function MyDashboard() {
  // Initialisation ------------------------------
  const { loggedinUser } = useAuth();

  // State ---------------------------------------
  // Context -------------------------------------
  // Methods -------------------------------------
  // View ----------------------------------------
  return (
    <section>
      <h1>My Dashboard</h1>

      <Panel.Static level={4}>
        <MyModules loggedinUserID={loggedinUser.UserID} />
      </Panel.Static>

      <Panel.Static level={4}>
        <MyProjects loggedinUserID={loggedinUser.UserID} />
      </Panel.Static>

    </section>
  );
}
