
/*
 * GET blog listing.
 */
//var app = express();
exports.index = function(req, res){
//  res.send("blog page");
  res.render('blog/list', { pagetitle:'这里是blog的index页，pagetitle',
                            h1title: '这里是blog的index页，h1title' });
};
exports.list = function(req,res){
  console.log(req.params.id)
  var vid =  req.params.id;
  var cont = arr[vid];
  res.render('blog/list', { pagetitle:'这里是blog的list页，pagetitle',
                            h1title: '这里是blog的list页，h1title',
                          content:cont
                          });
}