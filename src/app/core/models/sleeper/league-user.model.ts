export interface LeagueUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
  metadata: { team_name: string };
  is_owner: boolean;
  totalSpent: number;
  startersSpent: number;
  benchSpent: number;
}