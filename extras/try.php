<?php 

class Person {
    public $name;
    public $age;
  
    public function __construct($name, $age) {
      $this->name = $name;
      $this->age = $age;
    }
  }
  
  $person = new Person("John Doe", 30);
  
  echo "<pre>";
  print_r($person);
  echo "</pre>";

$index = 0;
  while ($index < 10) {
    echo 'The name of person is: '.$person->name." and his age is: " . $person->age++    . '<br>';
    $index ++;
  }
  

?>