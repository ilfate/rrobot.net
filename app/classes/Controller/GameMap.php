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
  
}

?>
