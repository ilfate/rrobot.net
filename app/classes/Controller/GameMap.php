<?php
/**
 * ILFATE PHP ENGINE
 * @autor Ilya Rubinchik ilfate@gmail.com
 * 2012
 */

/**
 * Description of Main
 *
 * @author ilfate
 */
class Controller_GameMap extends Controller {
  //put your code here
  
  /**
   * 
   * @return type 
   */
  public function index() 
  {
    Js::add(Js::C_ONLOAD, 'CanvasActions.init()');
    return array();
  }
  /**
   * 
   * @return type 
   */
  public function libCanvas() 
  {
    Js::add(Js::C_ONLOAD, 'CanvasActions.init()');
    return array(
        'layout' => array('html.tpl', 'head_libCanvas.tpl', 'layout.tpl')
    );
  }
  /**
   * 
   * @return type 
   */
  public function webSocket() 
  {
    Js::add(Js::C_ONLOAD, 'WSwrapper.init("'. substr(HTTP_ROOT, 7, -1) . '/ws'.'")');
    return array();
  }
  
  /**
   * 
   * @return type 
   */
  public function socketServer() 
  {
//    Js::add(Js::C_ONLOAD, 'WSwrapper.init("'.Helper::url('GameMap','socketServer').'")');
    return array();
  }
  
}

?>
