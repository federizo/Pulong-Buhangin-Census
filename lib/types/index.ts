export type IPermission = {
  agentId: string;
  agent_id: unknown;
  id: string;
  created_at: string;
  role: "user" | "admin";
  status: "active" | "resigned";
  member_id: string;
  member: {
    agentId: string;
    id: string;
    created_at: string;
    name: string;
    email: string;
  };
};
