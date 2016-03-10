<?php
	function generateRandomString($length = 10) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++)
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		return $randomString;
	}
	
	function pre_r($data){
		echo "<pre>";
		print_r($data);
		echo "<pre/>";
	}

	function quotteArray($data, $recursive = TRUE){
		$num = count($data);
		for($i=0 ; $i<$num ; $i++)
			if($recursive && is_array($data[$i]))
				$data[$i] = quotteArray($data[$i]);
			else
				$data[$i] = $actor = "'" . trim($data[$i]) . "'";
		return $data;
	}

	function echoArray($val, $delimiter, $show = FALSE){
		$res = is_array($val) ? join($delimiter, $val) : $val;
		if($show)
			echo $res;
		return $res;
	}

	function echoIf($val){
		if(isset($val))
			echo $val;
	}

	function wrapToTag($value, $tag, $show = false, $params = NULL){
		$res = "<$tag" . (is_null($params) ? " " : " " . $params) . ">" . $value . "</$tag>";
		if($show)
			echo $res;

		return $res;
	}

	function lowerTrim($string){
		return strtolower(trim($string));
	}
