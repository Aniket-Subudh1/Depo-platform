import express from 'express';
const router = express.Router();
import Project from '../../models/Project.js';
import Deployment from '../../models/Deployment.js';
import Redis from 'ioredis';
const redisConfig = {
    host: '______',
    port: 24291,
    username: 'default',
    password: '_____',
    tls: {}
};

router.get('/deploy', (req, res) => {
    res.send('API is working properly');
})
router.post('/deploy', async(req, res) => {
    const client = new Redis(redisConfig);
    try{
     let project =await Project.findOneAndUpdate({name:req.body.name},{projectstatus:req.body.status});
     if(project.url!=null && project.url!="" && project.url!=undefined){
        await client.set(`${project.name}`, project.url);
     }
     if(project==null){
        return res.status(400).json({message:"Project not found",success:false});
     }
     let updepl = await Deployment.findOneAndUpdate({projectid:project._id},{status:req.body.status});
     return res.status(200).json({message:"Project status updated successfully",success:true});
    }
    catch(err){
        return res.status(500).json({message:"Internal server error",success:false});
    }
})
export default {router};