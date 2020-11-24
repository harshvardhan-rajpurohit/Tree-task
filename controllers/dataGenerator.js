var bodyParser = require('body-parser');
var lodash = require('lodash');
var arrtoTree = require('array-to-tree');

function generateData(no_of_levels,no_of_nodes,no_of_nodes_lvl1) {
    let npl = Math.floor(no_of_nodes/ (no_of_levels-2));

    // -----------------Main Array---------------------
    let main_array= new Array();
    let level = 1;

    // -------------------------------DOMAIN ID---------------------
    let domain_id = "_GDPR"+ Math.random().toString(8).substr(2,5);


    // --------------------------global array for all the ids----------------
    let id_arr = new Array();


    // --------------------------function to generate random id-------------
    let ID = function () {
    let id = "_"+ Math.random().toString(32).substr(2,16);
    id_arr.push(id);
    return id;
    };


    // -----------------------tag names generated & stored in array--------------------
    let tag_arr=new Array();
    for (let i = 0; i < 25; i++) {
    tag_arr.push("tag"+i);
    }


    let random_tag=function(){181
        return (tag_arr[(Math.random()*24).toFixed(0)]); 
    }


    // ---------------------------select random parent------------------------
    let random_parent=function(level){
        if(level==1 && main_array.length<no_of_nodes_lvl1){
            return null;
        }
      
        else if(level==2 && main_array.length<(npl+no_of_nodes_lvl1)){    
          let len = id_arr.slice(0,no_of_nodes_lvl1);
          let x = len[(Math.random()*(len.length-1)).toFixed(0)];
          return (x); 
        }
      
        else if( level==3 && main_array.length<(npl+no_of_nodes_lvl1+npl)){
          let len = id_arr.slice(no_of_nodes_lvl1,(no_of_nodes_lvl1+npl));
          let x = len[(Math.random()*(len.length-1)).toFixed(0)];
          return (x); 
        }
        
        else {
          let len = id_arr.slice(no_of_nodes_lvl1+npl,main_array.length);
          let x = len[(Math.random()*(len.length-1)).toFixed(0)];
          return (x); 
        }
      }

    function randParent(level){

    }
    
    // ----------------------create arr---------------------
    function push_obj(){

    let obj = {
        _id: ID(),
        tag: random_tag(),
        parentId:random_parent(level),
        domainId: domain_id,
        description:"abc"
    } 
    main_array.push(obj); 

    if(main_array.length==no_of_nodes_lvl1){
        level++;
    }
    else if(main_array.length==(npl+no_of_nodes_lvl1)){
        level++;
    }
    else if(id_arr.length==(npl+npl+no_of_nodes_lvl1)){
        level++;
    }

    let lvls = 0;
    let flvls = no_of_levels-2;
        level = (lvls * npl)+ no_of_nodes_lvl1;
        lvls++;
    
    } 

    for (let j = 0; j < no_of_nodes; j++) { push_obj();}


// ----------------------------------------------------SEARCH PARENT------------
    function search_parent(obj){
        let path = new Array();
        if(obj.parentId == null && path.length < 1){
            path.unshift(obj);
        }
        while(obj.parentId!=null){
            path.unshift(obj);
            obj = main_array.find(a=>a._id==obj.parentId)
            if(obj.parentId==null){
                 path.unshift(obj)
                break;
            }
        }
        return path;
    }

    // -------------------------------------------------creating the tree-------------------------
    let final_tree=[];
    function unflatten(tree_arr) {
        var tree = [],
            mappedArr = {},
            arrElem,
            mappedElem;
    
        // First map the nodes of the array to an object -> create a hash table.
        for(var i = 0, len = tree_arr.length; i < len; i++) {
        arrElem = tree_arr[i];
        mappedArr[arrElem._id] = arrElem;
        mappedArr[arrElem._id]['children'] = [];
        }
    
    
        for (var id in mappedArr) {
        if (mappedArr.hasOwnProperty(id)) {
            mappedElem = mappedArr[id];
    
            // If the element is not at the root level, add it to its parent array of children.
            if (mappedElem.parentId!=null) {
            mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
            }
    
            // If the element is at the root level, add it to first level elements array.
            else {
            tree.push(mappedElem);
            }
        }
        }
        return tree;
    }

    main_array.forEach(element => {
        final_tree.push(unflatten(search_parent(element)));
        final_tree = lodash.flatten(final_tree);
    });
    let arar = lodash.uniqBy(final_tree,"_id");
    return arar;
}

var displayArr=[];
var urlencodedParser = bodyParser.urlencoded({extended:false});
module.exports = function(app){
    app.get('/index',function(req,res){
        console.log(req.url);
        // displayArr=[];
        res.render('index',{displayArr,arrtoTree});
    });

    app.post('/index',urlencodedParser,(req,res)=>{
        console.log(req.body);
        var no_of_levels = +req.body.nLevels;
        var no_of_nodes = +req.body.nNodes;
        var no_of_nodes_lvl1 = +req.body.nNodesL1;
        displayArr = generateData(no_of_levels,no_of_nodes,no_of_nodes_lvl1);
        res.json(displayArr);
    });
}