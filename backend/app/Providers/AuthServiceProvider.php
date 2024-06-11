<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Lang;


class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy',
    ];

    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
//correo direccion
        $env = "http://localhost:5173";
        if(env('APP_ENV') == "env") {
            $env = "https://tenocode.com";
        }

        // Usar la URL base dentro del closure
        VerifyEmail::toMailUsing(function ($notifiable, $url) use ($env) {

            // Cambiamos la URL a auth/verifyEmail y luego le agregamos los datos de la URL
            $parsedUrl = parse_url($url);
            $queryParams = [];
            parse_str($parsedUrl['query'], $queryParams);

            $finalUrl = sprintf('%s/verifyEmail/%s/%s',
                $env,
                $notifiable->getKey(),
                sha1($notifiable->getEmailForVerification()),
            );
        
            //cambiamos los datos del mensaje y el nombre del botón
            return (new MailMessage)
                ->subject(Lang::get('Verificación de Email '))
                ->line(Lang::get('Favor verifica tu email visitando el siguiente link:'))
                ->action(Lang::get('Verifica tu Email'), $finalUrl)
                ->line(Lang::get('Este email ha sido enviado de forma automática, favor no responder.'));
            });
    }
    
}
