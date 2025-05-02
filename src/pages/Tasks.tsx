
import Layout from '@/components/layout/Layout';
import { TasksContent } from '@/components/tasks/TasksContent';

const Tasks = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tareas</h1>
        <p className="text-muted-foreground">
          Administra todas las tareas de tus propiedades
        </p>
      </div>

      <TasksContent />
    </Layout>
  );
};

export default Tasks;
