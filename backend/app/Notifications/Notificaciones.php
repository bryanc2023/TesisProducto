<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class Notificaciones extends Notification
{
    use Queueable;

    public $mensaje;
    public $asunto;
    public $destinatario;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($mensaje, $asunto, $destinatario)
    {
        $this->mensaje = $mensaje;
        $this->asunto = $asunto;
        $this->destinatario = $destinatario;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'mensaje' => $this->mensaje,
            'asunto' => $this->asunto,
            'destinatario' => $this->destinatario
        ];
    }
}
