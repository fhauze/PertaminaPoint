import api from "@/util/api";
import { useAuthStore } from "../stores/auth";

export const getMissions = async () => {
    const res =  await api.get("/mission/missions");
    const data = res.data;
    const missions =  Array.isArray(data.results) ? data.results : [];
    const now = new Date().toISOString();

    const activeMissions = missions.filter(
        (mission) => mission.status === 'published' 
        && new Date(mission.date_time_from_valid) <= now
        && new Date(mission.date_time_to_valid) >= now 
    );

    return {
      ...data,
      count: activeMissions.length,
      results: activeMissions,
      allMissions: missions
    };
};

export const getMissionLogs = async () => {
    return await api.get("/mission/mission-logs/").then((res) => res.data);
}

export const createMissionLog = async (data = {}) => {
    const timestp = new Date().toISOString();
    return await api.post('mission/mission-logs',{
        mission: data.mission,
        user_id: data.user_id,
        status: 'completed',
        coin: data.coin,
        point: data.point,
        image_log: data.image_log,
        completed_at: timestp,
        claimed_at: timestp,
    });
}

export const updateMissionLog = async(missionId ,data = {}) =>{
    return await api.patch(`missions/${missionId}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
}


export const getUserPoint = async() =>{
    const auth = useAuthStore();
    const user = auth.user
    const [missions, missionLogs] = await Promise.all([getMissions(), getMissionLogs()]);
    const userLogs = missionLogs.results.filter((mlog) => mlog.user_id ===  user.id);    
    const activeTask = missions.results.filter((mission) => mission.date_time_from_valid <= timestp && timestp <= mission.date_time_to_valid);

    console.log("active missions:" + activeTask.length)
    const combine = userLogs.map(
        log => {
            const missionDetail = missions.allMissions.find((mission) => mission.id === log.mission);
            
            return {
                ...log,
                mission: missionDetail || null
            }
        }
    );
    // all points
    const timestp = new Date().toISOString();
    const myPoints = combine.reduce((total, log) => total + log.point, 0);
    const mytaskActiveComplete = combine.filter((c) =>{
            const inRange = c.mission.date_time_from_valid <= timestp && timestp <= c.date_time_to_valid
                return inRange && c.status === 'completed'
        });

    return {
        task: missions, // all missions
        taskCount: missions.allMissions.length, // count all
        activeTask: activeTask, // task active ()
        activeTaskCount: activeTask.length, // count active
        myTask: combine,
        myTaskCount: combine.length,
        myActiveTaskComplete: mytaskActiveComplete,// active mission
        myActiveTaskCompleteCount: mytaskActiveComplete.length,
        myPoints : myPoints,
    };
}