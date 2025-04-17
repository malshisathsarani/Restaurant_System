<?php

namespace App\Repositories\All\Businesses;

use App\Repositories\Base\BaseRepositoryInterface;

interface BusinessInterface extends BaseRepositoryInterface
{
   
   
public function findByIdWithRelations(int $id, array $relations);

}